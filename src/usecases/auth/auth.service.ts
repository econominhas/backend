import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	Inject,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";
import { SignInProviderEnum, type Account } from "@prisma/client";

import { AuthProviderAdapter } from "adapters/auth-provider";
import { RefreshTokenRepositoryService } from "repositories/postgres/refresh-token/refresh-token-repository.service";
import { MagicLinkCodeRepositoryService } from "repositories/postgres/magic-link-code/magic-link-code-repository.service";
import {
	AuthRepository,
	AuthUseCase,
	type AuthOutput,
	type CreateWithExternalProviderInput,
	type CreateWithEmailProviderInput,
	type CreateWithPhoneProviderInput,
	type ExchangeCodeInput,
	type RefreshOutput,
	type RefreshTokenInput,
} from "models/auth";
import { AuthRepositoryService } from "repositories/postgres/auth/auth-repository.service";
import { TermsAndPoliciesUseCase } from "models/terms-and-policies";
import { MagicLinkCodeRepository } from "models/magic-link-code";
import { RefreshTokenRepository } from "models/refresh-token";
import { TokenAdapter } from "adapters/token";
import { EmailAdapter } from "adapters/email";
import { SmsAdapter } from "adapters/sms";
import { GoogleAdapterService } from "adapters/implementations/google/google.service";
import { SESAdapterService } from "adapters/implementations/ses/ses.service";
import { SNSSMSAdapterService } from "adapters/implementations/sns-sms/sns.service";
import { PasetoAdapterService } from "adapters/implementations/paseto/paseto.service";
import { FacebookAdapterService } from "adapters/implementations/facebook/facebook.service";

import { TermsAndPoliciesService } from "../terms-and-policies/terms-and-policies.service";

interface CreateFromExternalProviderInput
	extends CreateWithExternalProviderInput {
	provider: AuthProviderAdapter;
	providerType: SignInProviderEnum;
}

interface GenTokensInput {
	accountId: string;
	isFirstAccess: boolean;
	refresh: boolean;
}

@Injectable()
export class AuthService extends AuthUseCase {
	constructor(
		@Inject(AuthRepositoryService)
		private readonly authRepository: AuthRepository,
		@Inject(MagicLinkCodeRepositoryService)
		private readonly magicLinkCodeRepository: MagicLinkCodeRepository,
		@Inject(RefreshTokenRepositoryService)
		private readonly refreshTokenRepository: RefreshTokenRepository,

		@Inject(TermsAndPoliciesService)
		private readonly termsAndPoliciesService: TermsAndPoliciesUseCase,

		@Inject(GoogleAdapterService)
		private readonly googleAdapter: AuthProviderAdapter,
		@Inject(FacebookAdapterService)
		private readonly facebookAdapter: AuthProviderAdapter,
		@Inject(PasetoAdapterService)
		private readonly tokenAdapter: TokenAdapter,
		@Inject(SESAdapterService)
		private readonly emailAdapter: EmailAdapter,
		@Inject(SNSSMSAdapterService)
		private readonly smsAdapter: SmsAdapter,
	) {
		super();
	}

	createFromGoogleProvider({
		code,
		originUrl,
	}: CreateWithExternalProviderInput): Promise<AuthOutput> {
		return this.createFromExternalProvider({
			provider: this.googleAdapter,
			providerType: SignInProviderEnum.GOOGLE,
			code,
			originUrl,
		});
	}

	createFromFacebookProvider({
		code,
		originUrl,
	}: CreateWithExternalProviderInput): Promise<AuthOutput> {
		return this.createFromExternalProvider({
			provider: this.facebookAdapter,
			providerType: SignInProviderEnum.FACEBOOK,
			code,
			originUrl,
		});
	}

	async createFromEmailProvider(
		i: CreateWithEmailProviderInput,
	): Promise<void> {
		let account = await this.authRepository.getByEmail({
			email: i.email,
		});
		let isFirstAccess = false;

		if (!account) {
			account = await this.authRepository.create({
				email: i.email,
			});

			isFirstAccess = true;
		}

		const { code } = await this.magicLinkCodeRepository.upsert({
			accountId: account.id,
			isFirstAccess,
		});

		await this.emailAdapter.send({
			to: account.email!,
			account,
			templateId: "MAGIC_LINK_LOGIN",
			placeholders: {
				code,
			},
		});
	}

	async createFromPhoneProvider(
		i: CreateWithPhoneProviderInput,
	): Promise<void> {
		let account = await this.authRepository.getByPhone({
			phone: i.phone,
		});
		let isFirstAccess = false;

		if (!account) {
			account = await this.authRepository.create({
				phone: i.phone,
			});

			isFirstAccess = true;
		}

		const { code } = await this.magicLinkCodeRepository.upsert({
			accountId: account.id,
			isFirstAccess,
		});

		await this.smsAdapter.send({
			to: account.phone!,
			account,
			templateId: "MAGIC_LINK_LOGIN",
			placeholders: {
				code,
			},
		});
	}

	async exchangeCode({
		accountId,
		code,
	}: ExchangeCodeInput): Promise<AuthOutput> {
		const magicLinkCode = await this.magicLinkCodeRepository.get({
			accountId,
			code,
		});

		if (!magicLinkCode) {
			throw new NotFoundException("Invalid code");
		}

		return this.genAuthOutput({
			accountId: magicLinkCode.accountId,
			isFirstAccess: magicLinkCode.isFirstAccess,
			refresh: true,
		});
	}

	async refreshToken({
		refreshToken,
	}: RefreshTokenInput): Promise<RefreshOutput> {
		const refreshTokenData = await this.refreshTokenRepository.get({
			refreshToken,
		});

		if (!refreshTokenData) {
			throw new NotFoundException("Refresh token not found");
		}

		return this.genAuthOutput({
			accountId: refreshTokenData.accountId,
			isFirstAccess: false,
			refresh: false,
		});
	}

	/**
	 * Private
	 *
	 * We set their accessibility to public so we can test it
	 */

	public async createFromExternalProvider({
		provider,
		providerType,
		code,
		originUrl,
	}: CreateFromExternalProviderInput): Promise<AuthOutput> {
		const { scopes, ...providerTokens } = await provider
			.exchangeCode({ code, originUrl })
			.catch(err => {
				Logger.error(err);

				throw new BadRequestException("Invalid code");
			});

		const missingScopes = provider.requiredScopes.filter(
			s => !scopes.includes(s),
		);

		if (missingScopes.length > 0) {
			throw new BadRequestException(
				`Missing required scopes: ${missingScopes.join(" ")}`,
			);
		}

		const providerData = await provider.getAuthenticatedUserData(
			providerTokens.accessToken,
		);

		if (!providerData.isEmailVerified) {
			throw new ForbiddenException("Unverified provider email");
		}

		const relatedAccounts = await this.authRepository.getManyByProvider({
			providerId: providerData.id,
			email: providerData.email,
			provider: providerType,
		});

		let account: Account;
		let isFirstAccess = false;

		if (relatedAccounts.length > 0) {
			const sameProviderId = relatedAccounts.find(a =>
				a.signInProviders.find(p => p.providerId === providerData.id),
			);
			const sameEmail = relatedAccounts.find(
				a => a.email === providerData.email,
			);

			/*
			 * Has an account with the same email, and it
			 * isn't linked with another provider account
			 */
			if (
				sameEmail &&
				!sameProviderId &&
				!sameEmail.signInProviders.find(p => p.provider === providerType)
			) {
				account = sameEmail;
			}

			/*
			 * Account with same provider id (it can have a different email,
			 * in case that the user updated it in provider or on our platform)
			 * More descriptive IF:
			 * if ((sameProviderId && !sameEmail) || (sameProviderId && sameEmail)) {
			 */
			if (sameProviderId) {
				account = sameProviderId;
			}

			if (!account) {
				throw new ConflictException(
					"Error finding account, please contact support",
				);
			}

			await this.authRepository.updateProvider({
				accountId: account.id,
				provider: providerType,
				providerId: providerData.id,
				accessToken: providerTokens.accessToken,
				refreshToken: providerTokens.refreshToken,
				expiresAt: providerTokens.expiresAt,
			});
		} else {
			account = await this.authRepository.create({
				email: providerData.email,
				[providerType.toLowerCase()]: {
					id: providerData.id,
					accessToken: providerTokens.accessToken,
					refreshToken: providerTokens.refreshToken,
					expiresAt: providerTokens.expiresAt,
				},
			});

			isFirstAccess = true;
		}

		return this.genAuthOutput({
			accountId: account.id,
			isFirstAccess,
			refresh: true,
		});
	}

	/**
	 * @private
	 */
	public async genAuthOutput({
		accountId,
		isFirstAccess,
		refresh,
	}: GenTokensInput): Promise<AuthOutput> {
		const promises = [];

		if (refresh) {
			promises.push(
				this.refreshTokenRepository.create({
					accountId,
				}),
			);
		} else {
			promises.push({ refreshToken: undefined });
		}

		if (!isFirstAccess) {
			promises.push(
				this.termsAndPoliciesService.hasAcceptedLatest({
					accountId,
				}),
			);
		} else {
			promises.push(false);
		}

		const [{ refreshToken }, hasAcceptedLatestTerms] = (await Promise.all(
			promises,
		)) as [{ refreshToken: string }, boolean];

		const { accessToken, expiresAt } = await this.tokenAdapter.genAccess({
			accountId,
			hasAcceptedLatestTerms,
		});

		return {
			accessToken,
			expiresAt,
			refreshToken,
			isFirstAccess,
		};
	}
}

import {
	BadRequestException,
	ConflictException,
	Inject,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { SignInProviderEnum, type Account } from "@prisma/client";
import { EmailAdapter } from "src/adapters/email";
import { GoogleAdapter } from "src/adapters/google";
import { FetchGoogleAdapter } from "src/adapters/implementations/google.service";
import { SESAdapter } from "src/adapters/implementations/ses.service";
import { JwtUidTokenAdapter } from "src/adapters/implementations/token.service";
import { SmsAdapter } from "src/adapters/sms";
import { AuthTokensAdapter } from "src/adapters/token";
import { AccountRepository } from "src/models/account";
import {
	AuthRepository,
	AuthUseCase,
	type AuthOutput,
	type CreateWith3rdPartyProviderInput,
	type CreateWithEmailProviderInput,
	type CreateWithPhoneProviderInput,
	type ExchangeCodeInput,
	type RefreshOutput,
	type RefreshTokenInput,
} from "src/models/auth";
import { MagicLinkCodeRepository } from "src/models/magic-link-code";
import { RefreshTokenRepository } from "src/models/refresh-token";
import { TermsAndPoliciesUseCase } from "src/models/terms-and-policies";
import { AccountRepositoryService } from "src/repositories/postgres/account/account-repository.service";
import { AuthRepositoryService } from "src/repositories/postgres/auth/auth-repository.service";
import { MagicLinkCodeRepositoryService } from "src/repositories/postgres/magic-link-code/magic-link-code-repository.service";
import { RefreshTokenRepositoryService } from "src/repositories/postgres/refresh-token/refresh-token-repository.service";

import { TermsAndPoliciesService } from "../terms-and-policies/terms-and-policies.service";

interface GenTokensInput {
	accountId: string;
	isFirstAccess: boolean;
	refresh?: boolean;
}

@Injectable()
export class AuthService extends AuthUseCase {
	private readonly requiredGoogleScopes = ["identify", "email"];

	constructor(
		@Inject(AuthRepositoryService)
		private readonly authRepository: AuthRepository,
		@Inject(AccountRepositoryService)
		private readonly accountRepository: AccountRepository,
		@Inject(MagicLinkCodeRepositoryService)
		private readonly magicLinkCodeRepository: MagicLinkCodeRepository,
		@Inject(RefreshTokenRepositoryService)
		private readonly refreshTokenRepository: RefreshTokenRepository,

		@Inject(TermsAndPoliciesService)
		private readonly termsAndPoliciesService: TermsAndPoliciesUseCase,

		@Inject(FetchGoogleAdapter)
		private readonly googleAdapter: GoogleAdapter,
		@Inject(JwtUidTokenAdapter)
		private readonly tokenAdapter: AuthTokensAdapter,
		@Inject(SESAdapter)
		private readonly emailAdapter: EmailAdapter,
		@Inject(SESAdapter)
		private readonly smsAdapter: SmsAdapter,
	) {
		super();
	}

	async createFromGoogleProvider({
		code,
		timezone,
		originUrl,
	}: CreateWith3rdPartyProviderInput): Promise<AuthOutput> {
		const { scopes, ...providerTokens } = await this.googleAdapter
			.exchangeCode({ code, originUrl })
			.catch(() => {
				throw new BadRequestException("Invalid code");
			});

		const missingScopes = this.requiredGoogleScopes.filter(
			s => !scopes.includes(s),
		);

		if (missingScopes.length > 0) {
			throw new BadRequestException(
				`Missing required scopes: ${missingScopes.join(" ")}`,
			);
		}

		const providerData = await this.googleAdapter.getAuthenticatedUserData(
			providerTokens.accessToken,
		);

		const relatedAccounts = await this.authRepository.getManyByProvider({
			providerId: providerData.id,
			email: providerData.email,
			provider: SignInProviderEnum.GOOGLE,
		});

		let account: Account;
		let isFirstAccess: true;

		if (relatedAccounts.length > 0) {
			const sameProviderId = relatedAccounts.find(
				a => a.signInProviders[0].providerId === providerData.id,
			);
			const sameEmail = relatedAccounts.find(
				a => a.email === providerData.email,
			);

			/*
			 * Has an account with the same email, and it
			 * isn't linked with another provider account
			 * or it has only one account
			 */
			if (
				sameEmail &&
				!sameProviderId &&
				(!sameEmail.signInProviders[0].providerId ||
					sameEmail.signInProviders[0].providerId ===
						sameProviderId.signInProviders[0].providerId)
			) {
				account = sameEmail;
			}
			/*
			 * Account with same provider id (it can have a different email,
			 * in case that the user updated it in provider)
			 */
			if ((sameProviderId && !sameEmail) || (sameProviderId && sameEmail)) {
				account = sameProviderId;
			}
			if (!account) {
				throw new ConflictException(
					"Error finding account, please contact support",
				);
			}

			await this.authRepository.updateProvider({
				accountId: account.id,
				provider: SignInProviderEnum.GOOGLE,
				providerId: providerData.id,
				accessToken: providerTokens.accessToken,
				refreshToken: providerTokens.refreshToken,
				expiresAt: providerTokens.expiresAt,
			});
		} else {
			account = await this.authRepository.create({
				email: providerData.email,
				timezone,
				google: {
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

	async createFromEmailProvider(
		i: CreateWithEmailProviderInput,
	): Promise<void> {
		let account = await this.authRepository.getByEmail({
			email: i.email,
		});
		let isFirstAccess: true = null;

		if (!account) {
			account = await this.authRepository.create({
				email: i.email,
				timezone: i.timezone,
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
		let isFirstAccess: true = null;

		if (!account) {
			account = await this.authRepository.create({
				phone: i.phone,
				timezone: i.timezone,
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

		const account = await this.accountRepository.getById({
			id: refreshTokenData.accountId,
		});

		if (!account) {
			throw new NotFoundException("User not found");
		}

		const { isFirstAccess: _, ...authOutput } = await this.genAuthOutput({
			accountId: refreshTokenData.accountId,
			isFirstAccess: false,
		});

		return authOutput;
	}

	// Private

	private async genAuthOutput({
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
			promises.push({ refreshToken: "" });
		}
		if (!isFirstAccess) {
			this.termsAndPoliciesService.hasAcceptedLatest({
				accountId,
			});
		} else {
			promises.push(false);
		}

		const [{ refreshToken }, hasAcceptedLatestTerms] = (await Promise.all(
			promises,
		)) as [{ refreshToken: string }, boolean];

		const { accessToken, expiresAt } = this.tokenAdapter.genAccess({
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

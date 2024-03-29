import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	Inject,
	Injectable,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import type {
	AuthOutput,
	CreateWith3rdPartyProviderInput,
	CreateWithEmailProviderInput,
	CreateWithPhoneProviderInput,
	ExchangeCodeInput,
	RefreshOutput,
	RefreshTokenInput,
} from 'models/auth';
import { AuthRepository } from 'models/auth';
import { MagicLinkCodeRepositoryService } from 'repositories/postgres/magic-link-code/magic-link-code-repository.service';
import { RefreshTokenRepositoryService } from 'repositories/postgres/refresh-token/refresh-token-repository.service';
import type { Account } from '@prisma/client';
import { SignInProviderEnum } from '@prisma/client';
import { TermsAndPoliciesService } from '../terms-and-policies/terms-and-policies.service';
import { AuthUseCase } from 'models/auth';
import { AuthRepositoryService } from 'repositories/postgres/auth/auth-repository.service';
import { TermsAndPoliciesUseCase } from 'models/terms-and-policies';
import { MagicLinkCodeRepository } from 'models/magic-link-code';
import { RefreshTokenRepository } from 'models/refresh-token';
import { GoogleAdapter } from 'adapters/google';
import { TokenAdapter } from 'adapters/token';
import { EmailAdapter } from 'adapters/email';
import { SmsAdapter } from 'adapters/sms';
import { GoogleAdapterService } from 'adapters/implementations/google/google.service';
import { JWTAdapterService } from 'adapters/implementations/jwt/token.service';
import { SESAdapterService } from 'adapters/implementations/ses/ses.service';
import { SNSAdapterService } from 'adapters/implementations/sns/sns.service';

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
		private readonly googleAdapter: GoogleAdapter,
		@Inject(JWTAdapterService)
		private readonly tokenAdapter: TokenAdapter,
		@Inject(SESAdapterService)
		private readonly emailAdapter: EmailAdapter,
		@Inject(SNSAdapterService)
		private readonly smsAdapter: SmsAdapter,
	) {
		super();
	}

	async createFromGoogleProvider({
		code,
		originUrl,
	}: CreateWith3rdPartyProviderInput): Promise<AuthOutput> {
		const { scopes, ...providerTokens } = await this.googleAdapter
			.exchangeCode({ code, originUrl })
			.catch((err) => {
				Logger.error(err);

				throw new BadRequestException('Invalid code');
			});

		const missingScopes = this.googleAdapter.requiredScopes.filter(
			(s) => !scopes.includes(s),
		);

		if (missingScopes.length > 0) {
			throw new BadRequestException(
				`Missing required scopes: ${missingScopes.join(' ')}`,
			);
		}

		const providerData = await this.googleAdapter.getAuthenticatedUserData(
			providerTokens.accessToken,
		);

		if (!providerData.isEmailVerified) {
			throw new ForbiddenException('Unverified provider email');
		}

		const relatedAccounts = await this.authRepository.getManyByProvider({
			providerId: providerData.id,
			email: providerData.email,
			provider: SignInProviderEnum.GOOGLE,
		});

		let account: Account;
		let isFirstAccess = false;

		if (relatedAccounts.length > 0) {
			const sameProviderId = relatedAccounts.find((a) =>
				a.signInProviders.find((p) => p.providerId === providerData.id),
			);
			const sameEmail = relatedAccounts.find(
				(a) => a.email === providerData.email,
			);

			// Has an account with the same email, and it
			// isn't linked with another provider account
			if (
				sameEmail &&
				!sameProviderId &&
				!sameEmail.signInProviders.find(
					(p) => p.provider === SignInProviderEnum.GOOGLE,
				)
			) {
				account = sameEmail;
			}

			// Account with same provider id (it can have a different email,
			// in case that the user updated it in provider or on our platform)
			// More descriptive IF:
			// if ((sameProviderId && !sameEmail) || (sameProviderId && sameEmail)) {
			if (sameProviderId) {
				account = sameProviderId;
			}

			if (!account) {
				throw new ConflictException(
					'Error finding account, please contact support',
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
		let isFirstAccess = false;

		if (!account) {
			account = await this.authRepository.create({
				email: i.email,
			});

			isFirstAccess = true;
		}

		const { code } = await this.magicLinkCodeRepository.upsert({
			accountId: account.id,
			isFirstAccess: isFirstAccess,
		});

		await this.emailAdapter.send({
			to: account.email!,
			account,
			templateId: 'MAGIC_LINK_LOGIN',
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
			isFirstAccess: isFirstAccess,
		});

		await this.smsAdapter.send({
			to: account.phone!,
			account,
			templateId: 'MAGIC_LINK_LOGIN',
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
			throw new NotFoundException('Invalid code');
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
			throw new NotFoundException('Refresh token not found');
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
					accountId: accountId,
				}),
			);
		} else {
			promises.push({ refreshToken: undefined });
		}

		if (!isFirstAccess) {
			promises.push(
				this.termsAndPoliciesService.hasAcceptedLatest({
					accountId: accountId,
				}),
			);
		} else {
			promises.push(false);
		}

		const [{ refreshToken }, hasAcceptedLatestTerms] = (await Promise.all(
			promises,
		)) as [{ refreshToken: string }, boolean];

		const { accessToken, expiresAt } = this.tokenAdapter.genAccess({
			accountId: accountId,
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

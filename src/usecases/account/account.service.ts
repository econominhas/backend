import { AccountRepositoryService } from 'src/repositories/postgres/account/account-repository.service';
import {
	BadRequestException,
	ConflictException,
	Inject,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { TokenAdapter } from 'src/adapters/implementations/token.service';
import {
	AccountUseCase,
	AuthOutput,
	CreateWith3rdPartyProviderInput,
	CreateWithEmailProviderInput,
	CreateWithPhoneProviderInput,
	ExchangeCodeInput,
	IamInput,
	IamOutput,
	RefreshOutput,
	RefreshTokenInput,
} from 'src/models/account';
import { SESAdapter } from 'src/adapters/implementations/ses.service';
import { MagicLinkCodeRepositoryService } from 'src/repositories/postgres/magic-link-code/magic-link-code-repository.service';
import { RefreshTokenRepositoryService } from 'src/repositories/postgres/refresh-token/refresh-token-repository.service';
import { GoogleAdapter } from 'src/adapters/implementations/google.service';
import { Account, SignInProviderEnum } from '@prisma/client';

@Injectable()
export class AccountService implements AccountUseCase {
	private readonly requiredGoogleScopes = ['identify', 'email'];

	constructor(
		@Inject(AccountRepositoryService)
		private readonly accountRepository: AccountRepositoryService,
		@Inject(MagicLinkCodeRepositoryService)
		private readonly magicLinkCodeRepository: MagicLinkCodeRepositoryService,
		@Inject(RefreshTokenRepositoryService)
		private readonly refreshTokenRepository: RefreshTokenRepositoryService,

		private readonly googleAdapter: GoogleAdapter,
		private readonly tokenAdapter: TokenAdapter,
		private readonly emailAdapter: SESAdapter,
		private readonly smsAdapter: any,
	) {}

	async createFromGoogleProvider({
		code,
		timezone,
		originUrl,
	}: CreateWith3rdPartyProviderInput): Promise<AuthOutput> {
		const { scopes, ...providerTokens } = await this.googleAdapter
			.exchangeCode({ code, originUrl })
			.catch(() => {
				throw new BadRequestException('Invalid code');
			});

		const missingScopes = this.requiredGoogleScopes.filter(
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

		const relatedAccounts = await this.accountRepository.getManyByProvider({
			providerId: providerData.id,
			email: providerData.email,
			provider: SignInProviderEnum.GOOGLE,
		});

		let account: Account;
		let isFirstAccess: true;

		if (relatedAccounts.length > 0) {
			const sameProviderId = relatedAccounts.find(
				(a) => a.SignInProvider[0].providerId === providerData.id,
			);
			const sameEmail = relatedAccounts.find(
				(a) => a.email === providerData.email,
			);

			// Has an account with the same email, and it
			// isn't linked with another provider account
			// or it has only one account
			if (
				sameEmail &&
				!sameProviderId &&
				(!sameEmail.SignInProvider[0].providerId ||
					sameEmail.SignInProvider[0].providerId ===
						sameProviderId.SignInProvider[0].providerId)
			) {
				account = sameEmail;
			}
			// Account with same provider id (it can have a different email,
			// in case that the user updated it in provider)
			if ((sameProviderId && !sameEmail) || (sameProviderId && sameEmail)) {
				account = sameProviderId;
			}
			if (!account) {
				throw new ConflictException(
					`Error finding account, please contact support`,
				);
			}

			await this.accountRepository.updateProvider({
				accountId: account.id,
				provider: SignInProviderEnum.GOOGLE,
				providerId: providerData.id,
				accessToken: providerTokens.accessToken,
				refreshToken: providerTokens.refreshToken,
				expiresAt: providerTokens.expiresAt,
			});
		} else {
			account = await this.accountRepository.create({
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

		const { refreshToken } = await this.refreshTokenRepository.create({
			accountId: account.id,
		});

		const { accessToken, expiresAt } = this.tokenAdapter.genAccess({
			id: account.id,
		});

		return {
			accessToken,
			expiresAt,
			refreshToken,
			isFirstAccess,
		};
	}

	async createFromEmailProvider(
		i: CreateWithEmailProviderInput,
	): Promise<void> {
		let account = await this.accountRepository.getByEmail({
			email: i.email,
		});
		let isFirstAccess: true = null;

		if (!account) {
			account = await this.accountRepository.create({
				email: i.email,
				timezone: i.timezone,
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
		let account = await this.accountRepository.getByPhone({
			phone: i.phone,
		});
		let isFirstAccess: true = null;

		if (!account) {
			account = await this.accountRepository.create({
				phone: i.phone,
				timezone: i.timezone,
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

		const { refreshToken } = await this.refreshTokenRepository.create({
			accountId: magicLinkCode.accountId,
		});

		const { accessToken, expiresAt } = this.tokenAdapter.genAccess({
			id: magicLinkCode.accountId,
		});

		return {
			refreshToken,
			accessToken,
			expiresAt,
			isFirstAccess: magicLinkCode.isFirstAccess || undefined,
		};
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

		const account = await this.accountRepository.getById({
			id: refreshTokenData.accountId,
		});

		if (!account) {
			throw new NotFoundException('User not found');
		}

		const { accessToken, expiresAt } = this.tokenAdapter.genAccess({
			id: refreshTokenData.accountId,
		});

		return {
			accessToken,
			expiresAt,
		};
	}

	async iam({ id }: IamInput): Promise<IamOutput> {
		const account = await this.accountRepository.getByIdWithProviders({ id });

		if (!account) {
			throw new UnauthorizedException('User not found');
		}

		const google = account.SignInProvider.find(
			(p) => p.provider === SignInProviderEnum.GOOGLE,
		);

		return {
			id,
			googleId: google.providerId,
		};
	}
}

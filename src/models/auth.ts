import {
	type Account,
	type SignInProvider,
	type SignInProviderEnum,
} from "@prisma/client";

/**
 *
 *
 * Repository
 *
 *
 */

export interface CreateWithEmail {
	email: string;
}
export interface CreateWithPhone {
	phone: string;
}
export interface CreateWithGoogle {
	email: string;
	google: {
		id: string;
		accessToken: string;
		refreshToken: string;
		expiresAt: Date;
	};
}
export interface CreateWithFacebook {
	email: string;
	facebook: {
		id: string;
		accessToken: string;
		expiresAt: Date;
	};
}

export type CreateInput =
	| CreateWithEmail
	| CreateWithFacebook
	| CreateWithGoogle
	| CreateWithPhone;

export interface GetByEmailInput {
	email: string;
}

export interface GetByPhoneInput {
	phone: string;
}

export interface GetByProviderInput {
	providerId: string;
	provider: SignInProviderEnum;
}

export interface GetManyByProviderInput {
	providerId: string;
	provider: SignInProviderEnum;
	email?: string;
}

export type GetManyByProviderOutput = Array<
	Account & {
		signInProviders: Array<SignInProvider>;
	}
>;

export interface UpdateNameInput {
	accountId: string;
	name: string;
}

export interface UpdateProviderInput {
	accountId: string;
	provider: SignInProviderEnum;
	providerId: string;
	accessToken: string;
	refreshToken: string;
	expiresAt: Date;
}

export abstract class AuthRepository {
	abstract create(i: CreateInput): Promise<Account>;

	abstract getByEmail(i: GetByEmailInput): Promise<Account | undefined>;

	abstract getByPhone(i: GetByPhoneInput): Promise<Account | undefined>;

	abstract getByProvider(i: GetByProviderInput): Promise<Account | undefined>;

	// Get by provider information (id or email)
	abstract getManyByProvider(
		i: GetManyByProviderInput,
	): Promise<GetManyByProviderOutput>;

	abstract updateProvider(i: UpdateProviderInput): Promise<void>;
}

/**
 *
 *
 * Usecase
 *
 *
 */

export interface AuthOutput {
	refreshToken: string;
	accessToken: string;
	expiresAt: string;
	isFirstAccess: boolean;
}

export interface RefreshOutput {
	accessToken: string;
	expiresAt: string;
}

export interface CreateWithExternalProviderInput {
	code: string;
	originUrl?: string;
}

export interface CreateWithEmailProviderInput {
	email: string;
}

export interface CreateWithPhoneProviderInput {
	phone: string;
}

export interface ExchangeCodeInput {
	accountId: string;
	code: string;
}

export interface RefreshTokenInput {
	refreshToken: string;
}

export abstract class AuthUseCase {
	abstract createFromGoogleProvider(
		i: CreateWithExternalProviderInput,
	): Promise<AuthOutput>;

	abstract createFromFacebookProvider(
		i: CreateWithExternalProviderInput,
	): Promise<AuthOutput>;

	abstract createFromEmailProvider(
		i: CreateWithEmailProviderInput,
	): Promise<void>;

	abstract createFromPhoneProvider(
		i: CreateWithPhoneProviderInput,
	): Promise<void>;

	abstract exchangeCode(i: ExchangeCodeInput): Promise<AuthOutput>;

	abstract refreshToken(i: RefreshTokenInput): Promise<RefreshOutput>;
}

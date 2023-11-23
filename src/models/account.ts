import {
	Collection,
	Entity,
	Enum,
	OneToMany,
	OneToOne,
	PrimaryKey,
	Property,
} from '@mikro-orm/core';
import { SignInProviderEnum } from 'src/types/enums/sign-in-provider';
import { TimezoneEnum } from 'src/types/enums/timezone';

@Entity()
class SignInProviderEntity {
	@PrimaryKey({ type: 'char(16)' })
	accountId!: string;

	@Enum(() => SignInProviderEnum)
	provider!: SignInProviderEnum;

	@PrimaryKey({ type: 'varchar(50)' })
	providerId!: string;

	@Property({ type: 'varchar(100)' })
	accessToken!: string;

	@Property({ type: 'varchar(100)' })
	refreshToken!: string;

	@Property({ type: 'timestamp' })
	expiresAt!: Date;
}

@Entity()
class ConfigEntity {
	@PrimaryKey({ type: 'char(16)' })
	id!: string;

	@Property({ type: 'varchar(20)' })
	name!: string;

	@Enum(() => TimezoneEnum)
	timezone!: TimezoneEnum;
}

@Entity()
export class AccountEntity {
	@PrimaryKey({ type: 'char(16)' })
	id!: string;

	@Property({ type: 'varchar(150)' })
	email!: string;

	@Property({ type: 'varchar(25)' })
	phone!: string;

	@Property({ type: 'timestamp' })
	createdAt = new Date();

	@OneToOne()
	config!: ConfigEntity;

	@OneToMany({ mappedBy: 'accountId' })
	signInProviders = new Collection<SignInProviderEntity>(this);
}

/**
 *
 *
 * Repository
 *
 *
 */

export type CreateInput =
	| {
			email: string;
			timezone: TimezoneEnum;
	  }
	| {
			phone: string;
			timezone: TimezoneEnum;
	  }
	| {
			email: string;
			timezone: TimezoneEnum;
			google: {
				id: string;
				accessToken: string;
				refreshToken: string;
				expiresAt: Date;
			};
	  };

export interface GetByIdInput {
	id: string;
}

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

export interface AccountRepository {
	create: (i: CreateInput) => Promise<AccountEntity>;

	getById: (i: GetByIdInput) => Promise<AccountEntity | undefined>;

	getByEmail: (i: GetByEmailInput) => Promise<AccountEntity | undefined>;

	getByPhone: (i: GetByPhoneInput) => Promise<AccountEntity | undefined>;

	getByProvider: (i: GetByProviderInput) => Promise<AccountEntity | undefined>;

	// Get by provider information (id or email)
	getManyByProvider: (
		i: GetManyByProviderInput,
	) => Promise<Array<AccountEntity>>;
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
}

export interface RefreshOutput {
	accessToken: string;
	expiresAt: string;
}

export interface CreateWithProviderInput {
	code: string;
	provider: SignInProviderEnum;
	timezone: TimezoneEnum;
}

export interface SendMagicLinkInput {
	email: string;
	timezone: TimezoneEnum;
}

export interface ExchangeMagicLinkCodeInput {
	id: string;
	code: string;
}

export interface IamInput {
	id?: string;
}

export interface RefreshTokenInput {
	refreshToken: string;
}

export interface IamOutput {
	id: string;
	googleId?: string;
}

export interface AccountUseCase {
	createFromGoogleOauth: (i: CreateWithProviderInput) => Promise<AuthOutput>;

	sendMagicLink: (i: SendMagicLinkInput) => Promise<void>;

	exchangeMagicLinkCode: (i: ExchangeMagicLinkCodeInput) => Promise<AuthOutput>;

	refreshToken: (i: RefreshTokenInput) => Promise<RefreshOutput>;

	iam: (i: IamInput) => Promise<IamOutput>;
}

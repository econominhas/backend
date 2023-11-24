import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import { SignInProviderEnum } from 'src/types/enums/sign-in-provider';

@Entity()
export class SignInProviderEntity {
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

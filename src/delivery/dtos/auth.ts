import { IsEmail, IsOptional, IsString } from 'class-validator';
import { IsID, IsSecretCode } from '../validators/internal';
import { IsPhone, IsURL } from '../validators/miscellaneous';

export class SignWith3rdPartyProviderDto {
	@IsString()
	code: string;

	@IsOptional()
	@IsURL({ acceptLocalhost: process.env['NODE_ENV'] !== 'production' })
	originUrl?: string;
}

export class CreateFromEmailProviderDto {
	@IsEmail()
	email: string;
}

export class CreateFromPhoneProviderDto {
	@IsPhone()
	phone: string;
}

export class ExchangeCodeDto {
	@IsID()
	accountId: string;

	@IsSecretCode()
	code: string;
}

export class RefreshTokenDto {
	@IsSecretCode()
	refreshToken: string;
}

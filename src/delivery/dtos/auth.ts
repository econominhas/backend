import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { IsID, IsSecretCode } from '../validators/internal';
import { IsPhone, IsURL } from '../validators/miscellaneous';
import { TimezoneEnum } from '@prisma/client';

export class CreateFromGoogleProviderDto {
	@IsNotEmpty()
	code: string;

	@IsURL({ acceptLocalhost: process.env['NODE_ENV'] !== 'production' })
	originUrl: string;

	@IsEnum(TimezoneEnum)
	timezone: TimezoneEnum;
}

export class CreateFromEmailProviderDto {
	@IsEmail()
	email: string;

	@IsEnum(TimezoneEnum)
	timezone: TimezoneEnum;
}

export class CreateFromPhoneProviderDto {
	@IsPhone()
	phone: string;

	@IsEnum(TimezoneEnum)
	timezone: TimezoneEnum;
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

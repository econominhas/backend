import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { IsID, IsSecretCode } from '../validators/internal';
import { IsPhone, IsURL } from '../validators/miscellaneous';
import { TimezoneEnum } from 'src/types/enums/timezone';

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

export class IamUserDataDto {
	@IsOptional()
	@IsID()
	accountId?: string;
}

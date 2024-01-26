import {
	IsDate,
	IsEnum,
	IsNumberString,
	IsOptional,
	Length,
} from 'class-validator';
import { IsAmount, IsID, IsName } from '../validators/internal';
import { IsDay } from '../validators/date';
import { PayAtEnum } from '@prisma/client';
import { PaginatedDto } from '.';

export class CreateDto {
	@IsID()
	cardProviderId: string;

	@IsName()
	name: string;

	@IsNumberString({ no_symbols: true })
	@Length(4)
	lastFourDigits: string;

	@IsOptional()
	@IsDay()
	dueDay?: number;

	@IsOptional()
	@IsAmount()
	limit?: number;

	@IsOptional()
	@IsAmount()
	balance?: number;

	@IsOptional()
	@IsEnum(PayAtEnum)
	payAt?: PayAtEnum;

	@IsOptional()
	@IsID()
	bankAccountId?: string;
}

export class GetPostpaidDto extends PaginatedDto {
	@IsDate()
	date: Date;
}

export class GetBillsToBePaidDto extends PaginatedDto {
	@IsDate()
	date: Date;
}

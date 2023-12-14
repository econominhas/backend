import { IsEnum, IsOptional } from 'class-validator';
import { IsAmount, IsID, IsName } from '../validators/internal';
import { IsDay } from '../validators/date';
import { IsNumberString } from '../validators/miscellaneous';
import { PayAtEnum } from 'types/enums/pay-at';

export class CreateDto {
	@IsID()
	cardProviderId: string;

	@IsName()
	name: string;

	@IsNumberString(4)
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

	@IsOptional()
	@IsID()
	budgetId?: string;
}

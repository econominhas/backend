import { IsAmount, IsDescription, IsID, IsName } from '../validators/internal';
import { IsMonth, IsYear } from '../validators/date';
import { IsDate } from 'class-validator';

export class GetListDto {
	@IsID()
	budgetId: string;

	@IsMonth()
	month: number;

	@IsYear()
	year: number;
}

export class TransferDto {
	@IsName()
	name: string;

	@IsAmount()
	amount: number;

	@IsID()
	bankAccountFromId: string;

	@IsID()
	bankAccountToId: string;

	@IsID()
	budgetDateId: string;

	@IsDescription()
	description: string;

	@IsDate()
	createdAt: Date;
}

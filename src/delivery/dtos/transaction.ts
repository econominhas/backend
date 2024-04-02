import { IsDate, IsIn, IsPositive } from "class-validator";
import { TransactionTypeEnum } from "@prisma/client";

import {
	IsAmount,
	IsDescription,
	IsID,
	IsTransactionName,
} from "../validators/internal";
import { IsMonth, IsYear } from "../validators/date";

export class GetListDto {
	@IsID()
	budgetId: string;

	@IsMonth()
	month: number;

	@IsYear()
	year: number;
}

export class TransferDto {
	@IsTransactionName()
	name: string;

	@IsDescription()
	description: string;

	@IsAmount()
	amount: number;

	@IsID()
	bankAccountFromId: string;

	@IsID()
	bankAccountToId: string;

	@IsID()
	budgetDateId: string;

	@IsDate()
	createdAt: Date;
}

export class InOutDto {
	@IsIn([TransactionTypeEnum.IN, TransactionTypeEnum.OUT])
	type: typeof TransactionTypeEnum.IN | typeof TransactionTypeEnum.OUT;

	@IsTransactionName()
	name: string;

	@IsDescription()
	description: string;

	@IsAmount()
	amount: number;

	@IsID()
	bankAccountId: string;

	@IsID()
	budgetDateId: string;

	@IsID()
	categoryId: string;

	@IsDate()
	createdAt: Date;
}

export class CreditDto {
	@IsTransactionName()
	name: string;

	@IsDescription()
	description: string;

	@IsAmount()
	amount: number;

	@IsPositive()
	installments: number;

	@IsID()
	categoryId: string;

	@IsID()
	cardId: string;

	@IsID()
	budgetDateId: string;

	@IsDate()
	createdAt: Date;
}

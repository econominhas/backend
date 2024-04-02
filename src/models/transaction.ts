/**
 *
 *
 * Repository
 *
 *
 */

import { type IconEnum, type TransactionTypeEnum } from "@prisma/client";

import {
	type Paginated,
	type PaginatedItems,
	type PaginatedRepository,
} from "types/paginated-items";

export interface GetMonthlyAmountByCategoryInput {
	accountId: string;
	budgetId: string;
	month: number;
	year: number;
}

export type GetMonthlyAmountByCategoryOutput = Array<{
	categoryId: string;
	amount: number;
}>;

export interface GetByBudgetInput extends PaginatedRepository {
	accountId: string;
	budgetId: string;
	year: number;
	month: number;
}

export interface GetByBudgetOutput {
	id: string;
	name: string;
	amount: number;
	type: TransactionTypeEnum;
	installment?: {
		total: number;
		current: number;
	};
	category: {
		icon: IconEnum;
		color: string;
	};
}

export interface CreateTransferInput {
	accountId: string;
	name: string;
	amount: number;
	bankAccountFromId: string;
	bankAccountToId: string;
	budgetDateId: string;
	description: string;
	createdAt: Date;
	isSystemManaged: boolean;
	recurrentTransactionId?: string;
}

export interface CreateInOutInput {
	type: typeof TransactionTypeEnum.IN | typeof TransactionTypeEnum.OUT;
	accountId: string;
	name: string;
	amount: number;
	categoryId: string;
	bankAccountId: string;
	budgetDateId: string;
	description: string;
	createdAt: Date;
	isSystemManaged: boolean;
	recurrentTransactionId?: string;
}

export interface CreateCreditInput {
	common: {
		accountId: string;
		name: string;
		amount: number;
		categoryId: string;
		cardId: string;
		description: string;
		createdAt: Date;
		isSystemManaged: boolean;
		recurrentTransactionId?: string;
		installment: {
			installmentGroupId: string;
			total: number;
		};
	};
	unique: Array<{
		budgetDateId: string;
		installment: {
			current: number;
			cardBillId: string;
		};
	}>;
}

export abstract class TransactionRepository {
	abstract getMonthlyAmountByCategory(
		i: GetMonthlyAmountByCategoryInput,
	): Promise<GetMonthlyAmountByCategoryOutput>;

	abstract getByBudget(i: GetByBudgetInput): Promise<Array<GetByBudgetOutput>>;

	abstract createTransfer(i: CreateTransferInput): Promise<void>;

	abstract createInOut(i: CreateInOutInput): Promise<void>;

	abstract createCredit(i: CreateCreditInput): Promise<void>;
}

/**
 *
 *
 * Usecase
 *
 *
 */

export interface GetListInput extends Paginated {
	accountId: string;
	budgetId: string;
	year: number;
	month: number;
}

export interface TransferInput {
	accountId: string;
	name: string;
	description: string;
	amount: number;
	bankAccountFromId: string;
	bankAccountToId: string;
	budgetDateId: string;
	createdAt: Date;
	isSystemManaged?: boolean;
	recurrentTransactionId?: string;
}

export interface InOutInput {
	type: typeof TransactionTypeEnum.IN | typeof TransactionTypeEnum.OUT;
	accountId: string;
	name: string;
	description: string;
	amount: number;
	categoryId: string;
	bankAccountId: string;
	budgetDateId: string;
	createdAt: Date;
	isSystemManaged?: boolean;
	recurrentTransactionId?: string;
}

export interface CreditInput {
	accountId: string;
	name: string;
	description: string;
	amount: number;
	installments: number;
	categoryId: string;
	cardId: string;
	budgetDateId: string;
	createdAt: Date;
	isSystemManaged?: boolean;
	recurrentTransactionId?: string;
}

export abstract class TransactionUseCase {
	abstract getList(i: GetListInput): Promise<PaginatedItems<GetByBudgetOutput>>;

	abstract transfer(i: TransferInput): Promise<void>;

	abstract inOut(i: InOutInput): Promise<void>;

	abstract credit(i: CreditInput): Promise<void>;
}

/**
 *
 *
 * Repository
 *
 *
 */

import type { IconEnum, TransactionTypeEnum } from '@prisma/client';
import type {
	Paginated,
	PaginatedItems,
	PaginatedRepository,
} from 'types/paginated-items';

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

export interface GetByCardIdBetweenDatesInput extends PaginatedRepository {
	cardsIds: Array<string>;
	dateFrom: Date;
	dateTo: Date;
}

export interface GetByCardIdBetweenDatesOutput {
	cardId: string;
	createdAt: Date;
	amount: number;
}

export abstract class TransactionRepository {
	abstract getMonthlyAmountByCategory(
		i: GetMonthlyAmountByCategoryInput,
	): Promise<GetMonthlyAmountByCategoryOutput>;

	abstract getByBudget(i: GetByBudgetInput): Promise<Array<GetByBudgetOutput>>;

	abstract getByCardIdBetweenDates(
		i: GetByCardIdBetweenDatesInput,
	): Promise<Array<GetByCardIdBetweenDatesOutput>>;
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

export abstract class TransactionUseCase {
	abstract getList(i: GetListInput): Promise<PaginatedItems<GetByBudgetOutput>>;
}

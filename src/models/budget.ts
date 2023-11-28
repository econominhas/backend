import type { Budget, Category, TimezoneEnum } from '@prisma/client';

/**
 *
 *
 * Repository
 *
 *
 */

export interface CreateWithItemsInput {
	accountId: string;
	name: string;
	description: string;
	items: Array<{
		categoryId: string;
		month: number;
		amount: number;
		year: number;
	}>;
}

export interface GetMonthlyBudgetByCategoryInput {
	accountId: string;
	budgetId: string;
	timezone: TimezoneEnum;
}

export type GetMonthlyBudgetByCategoryOutput = Array<{
	category: Category;
	amount: number;
}>;

export abstract class BudgetRepository {
	abstract createWithItems(i: CreateWithItemsInput): Promise<Budget>;

	abstract getMonthlyBudgetByCategory(
		i: GetMonthlyBudgetByCategoryInput,
	): Promise<GetMonthlyBudgetByCategoryOutput | undefined>;
}

/**
 *
 *
 * Usecase
 *
 *
 */

export interface CreateInput {
	accountId: string;
	name: string;
	description: string;
	year: number;
	items: Array<{
		categoryId: string;
		items: Array<{
			month: number;
			amount: number;
		}>;
	}>;
}

export interface CreateBasicInput {
	accountId: string;
	name: string;
	description: string;
	year: number;
	items: Array<{
		categoryId: string;
		amount: number;
	}>;
}

export abstract class BudgetUseCase {
	abstract create(i: CreateInput): Promise<Budget>;

	abstract createBasic(i: CreateBasicInput): Promise<Budget>;
}

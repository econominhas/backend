import type { Budget, Category } from '@prisma/client';

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
	months: Array<{
		month: number;
		year: number;
		items: Array<{
			categoryId: string;
			amount: number;
		}>;
	}>;
}

export interface GetMonthlyByCategoryInput {
	accountId: string;
	budgetId: string;
	month: number;
	year: number;
}

export type GetMonthlyByCategoryOutput = Array<{
	categoryId: string;
	amount: number;
}>;

export abstract class BudgetRepository {
	abstract createWithItems(i: CreateWithItemsInput): Promise<Budget>;

	abstract getMonthlyByCategory(
		i: GetMonthlyByCategoryInput,
	): Promise<GetMonthlyByCategoryOutput | undefined>;
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
	months: Array<{
		month: number;
		items: Array<{
			categoryId: string;
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

export interface OverviewInput {
	accountId: string;
	budgetId: string;
	month: number;
	year: number;
}

export interface OverviewOutput {
	totalExpenses: number;
	totalBudget: number;
	remainingBudget: number;
	budgetByCategory: Array<
		Omit<Category, 'accountId'> & {
			totalExpenses: number;
			totalBudget: number;
			remainingBudget: number;
		}
	>;
}

export abstract class BudgetUseCase {
	abstract create(i: CreateInput): Promise<Budget>;

	abstract createBasic(i: CreateBasicInput): Promise<Budget>;

	abstract overview(i: OverviewInput): Promise<OverviewOutput>;
}

/**
 *
 *
 * Repository
 *
 *
 */

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

export abstract class TransactionRepository {
	abstract getMonthlyAmountByCategory(
		i: GetMonthlyAmountByCategoryInput,
	): Promise<GetMonthlyAmountByCategoryOutput>;
}

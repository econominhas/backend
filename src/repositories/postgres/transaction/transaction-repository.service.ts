import { Injectable } from '@nestjs/common';
import { InjectRepository, Repository } from '..';
import type {
	GetMonthlyAmountByCategoryInput,
	GetMonthlyAmountByCategoryOutput,
} from 'src/models/transaction';
import { TransactionRepository } from 'src/models/transaction';

@Injectable()
export class TransactionRepositoryService extends TransactionRepository {
	constructor(
		@InjectRepository('transaction')
		private readonly transactionRepository: Repository<'transaction'>,
	) {
		super();
	}

	async getMonthlyAmountByCategory({
		accountId,
		budgetId,
		month,
		year,
	}: GetMonthlyAmountByCategoryInput): Promise<GetMonthlyAmountByCategoryOutput> {
		const transactions = await this.transactionRepository.findMany({
			select: {
				amount: true,
				budgetDate: {
					select: {
						budgetItems: {
							select: {
								categoryId: true,
							},
						},
					},
				},
			},
			where: {
				accountId,
				budgetDate: {
					is: {
						budgetId,
						month,
						year,
					},
				},
			},
		});

		const expensesPerCategory: Record<
			string,
			{
				categoryId: string;
				amount: number;
			}
		> = {};

		for (const transaction of transactions) {
			const { categoryId } = transaction.budgetDate.budgetItems[0];
			const { amount } = transaction;

			if (expensesPerCategory[categoryId]) {
				expensesPerCategory[categoryId] = {
					categoryId,
					amount,
				};
			} else {
				expensesPerCategory[categoryId].amount += amount;
			}
		}

		return Object.values(expensesPerCategory);
	}
}

import { Injectable } from '@nestjs/common';
import { InjectRepository, Repository } from '..';
import type {
	GetByBudgetInput,
	GetByBudgetOutput,
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

	getByBudget({
		accountId,
		budgetId,
		month,
		year,
		limit,
		offset,
	}: GetByBudgetInput): Promise<GetByBudgetOutput[]> {
		return this.transactionRepository.findMany({
			select: {
				id: true,
				name: true,
				amount: true,
				type: true,
				installment: {
					select: {
						total: true,
						current: true,
					},
				},
				category: {
					select: {
						icon: true,
						color: true,
					},
				},
			},
			where: {
				accountId,
				budgetDate: {
					budgetId,
					month,
					year,
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
			skip: offset,
			take: limit,
		});
	}
}

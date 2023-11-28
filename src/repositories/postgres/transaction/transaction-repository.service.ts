import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository, Repository } from '..';
import { DayjsAdapter } from 'src/adapters/implementations/dayjs.service';
import type {
	GetMonthlyAmountByCategoryInput,
	GetMonthlyAmountByCategoryOutput,
} from 'src/models/transaction';
import { TransactionRepository } from 'src/models/transaction';
import { DateAdapter } from 'src/adapters/date';

@Injectable()
export class TransactionRepositoryService extends TransactionRepository {
	constructor(
		@InjectRepository('transaction')
		private readonly transactionRepository: Repository<'transaction'>,

		@Inject(DayjsAdapter)
		private readonly dateAdapter: DateAdapter,
	) {
		super();
	}

	async getMonthlyAmountByCategory({
		accountId,
		budgetId,
		timezone,
		month: monthParam,
		year: yearParam,
	}: GetMonthlyAmountByCategoryInput): Promise<GetMonthlyAmountByCategoryOutput> {
		const { month, year } = this.dateAdapter.getTodayInfo(timezone);

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
						month: monthParam || month,
						year: yearParam || year,
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

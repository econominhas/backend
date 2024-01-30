import { Inject, Injectable } from '@nestjs/common';
import { TransactionTypeEnum, type RecurrentTransaction } from '@prisma/client';
import { DateAdapter } from 'adapters/date';
import { DayjsAdapterService } from 'adapters/implementations/dayjs/dayjs.service';

import {
	RecurrentTransactionRepository,
	RecurrentTransactionUseCase,
} from 'models/recurrent-transaction';
import { RecurrentTransactionRepositoryService } from 'repositories/postgres/recurrent-transaction/recurrent-transaction-repository.service';
import { MatchingDates } from './utils/matching-dates/matching-dates.service';
import { Formulas } from './utils/formula/formula.service';
import { TransactionUseCase } from 'models/transaction';
import { BudgetUseCase } from 'models/budget';
import { BudgetService } from 'usecases/budget/budget.service';
import { Cron } from '@nestjs/schedule';
import { UtilsAdapter } from 'adapters/utils';
import { UtilsAdapterService } from 'adapters/implementations/utils/utils.service';
import { TransactionService } from 'usecases/transaction/transaction.service';

interface ReplaceVarsInput {
	text: string;
	date: Date;
}

@Injectable()
export class RecurrentTransactionService extends RecurrentTransactionUseCase {
	constructor(
		@Inject(RecurrentTransactionRepositoryService)
		private readonly recurrentTransactionRepository: RecurrentTransactionRepository,

		@Inject(BudgetService)
		private readonly budgetService: BudgetUseCase,
		@Inject(TransactionService)
		private readonly transactionService: TransactionUseCase,

		@Inject(MatchingDates)
		private readonly matchingDates: MatchingDates,
		@Inject(Formulas)
		private readonly formulas: Formulas,

		@Inject(DayjsAdapterService)
		private readonly dateAdapter: DateAdapter,
		@Inject(UtilsAdapterService)
		private readonly utilsAdapter: UtilsAdapter,
	) {
		super();
	}

	// Every first day of the month
	@Cron('0 0 1 * *')
	/**
	 * @private
	 */
	async execMonthly(): Promise<void> {
		let recurrentTransactions: Array<RecurrentTransaction> = [];
		const limit = 1000;

		let page = 1;
		do {
			const { offset } = this.utilsAdapter.pagination({
				page,
				limit,
			});

			recurrentTransactions =
				await this.recurrentTransactionRepository.findMonthly({
					offset,
					limit,
				});

			if (recurrentTransactions.length === 0) {
				break;
			}

			await Promise.all(recurrentTransactions.map((rt) => this.create(rt)));

			page++;
		} while (recurrentTransactions.length === limit);
	}

	// Every year, on the first day of January
	@Cron('0 0 1 1 *')
	/**
	 * @private
	 */
	async execYearly(): Promise<void> {
		let recurrentTransactions: Array<RecurrentTransaction> = [];
		const limit = 1000;

		let page = 1;
		do {
			const { offset } = this.utilsAdapter.pagination({
				page,
				limit,
			});

			recurrentTransactions =
				await this.recurrentTransactionRepository.findYearly({
					offset,
					limit,
				});

			if (recurrentTransactions.length === 0) {
				break;
			}

			await Promise.all(recurrentTransactions.map((rt) => this.create(rt)));

			page++;
		} while (recurrentTransactions.length === limit);
	}

	/**
	 * @private
	 */
	async create({
		id,
		accountId,
		budgetId,
		/**
		 * Define if the recurrent transaction is automatic controlled by the system, or if it\'s created and controled by the user
		 */
		formulaToUse,
		startAt,
		baseAmounts,
		cCreates,
		cExcludes,
		cTryAgains,
		type,
		name,
		description,
		isSystemManagedT,
		categoryId,
		cardId,
		bankAccountId,
		bankAccountFromId,
		bankAccountToId,
	}: RecurrentTransaction) {
		const dates = this.matchingDates.getDates({
			cCreates,
			cExcludes,
			cTryAgains,
		});

		if (dates.length === 0) return;

		/**
		 * As the transactions always are in the same month,
		 * we only need to get/create 1 budgetDate
		 */
		const budgetDates = await this.budgetService.getOrCreateMany({
			dates: dates,
			budgetId,
			accountId,
		});

		const transactions: Array<Promise<any>> = dates.map((date, idx) => {
			const amount = this.formulas.calcAmount({
				formulaToUse,
				amount: this.getAmount(baseAmounts, idx),
				startAt,
			});

			const budgetDate = budgetDates.find(
				(bd) =>
					bd.month === this.dateAdapter.get(date, 'month') &&
					bd.year === this.dateAdapter.get(date, 'year'),
			);

			if (type === TransactionTypeEnum.CREDIT) {
				return this.transactionService.credit({
					recurrentTransactionId: id,
					accountId,
					name: this.replaceVars({
						text: name,
						date,
					}),
					description: this.replaceVars({
						text: description,
						date,
					}),
					categoryId,
					cardId,
					amount,
					budgetDateId: budgetDate.id,
					createdAt: date,
					installments: 1,
					isSystemManaged: isSystemManagedT,
				});
			}

			if (type === TransactionTypeEnum.IN || type === TransactionTypeEnum.OUT) {
				return this.transactionService.inOut({
					recurrentTransactionId: id,
					type,
					accountId,
					name: this.replaceVars({
						text: name,
						date,
					}),
					description: this.replaceVars({
						text: description,
						date,
					}),
					categoryId,
					amount,
					budgetDateId: budgetDate.id,
					createdAt: date,
					bankAccountId,
					isSystemManaged: isSystemManagedT,
				});
			}

			if (type === TransactionTypeEnum.TRANSFER) {
				return this.transactionService.transfer({
					recurrentTransactionId: id,
					accountId,
					name: this.replaceVars({
						text: name,
						date,
					}),
					description: this.replaceVars({
						text: description,
						date,
					}),
					bankAccountFromId,
					bankAccountToId,
					amount,
					budgetDateId: budgetDate.id,
					createdAt: date,
					isSystemManaged: isSystemManagedT,
				});
			}
		});

		await Promise.allSettled(transactions);
	}

	/**
	 * @private
	 */
	getAmount(baseAmounts: Array<number>, idx: number) {
		const value = baseAmounts[idx];

		return typeof value === 'number' ? value : baseAmounts[0];
	}

	/**
	 * @private
	 */
	replaceVars({ text, date }: ReplaceVarsInput): string {
		let finalText = text;

		finalText = finalText.replaceAll(
			'${DAY}',
			this.dateAdapter.get(date, 'day').toString(),
		);
		finalText = finalText.replaceAll(
			'${MONTH}',
			this.dateAdapter.get(date, 'month').toString(),
		);
		finalText = finalText.replaceAll(
			'${YEAR}',
			this.dateAdapter.get(date, 'year').toString(),
		);

		return finalText;
	}
}

import { Inject, Injectable } from '@nestjs/common';
import { UtilsAdapterService } from 'adapters/implementations/utils/utils.service';
import { UtilsAdapter } from 'adapters/utils';
import type { GetByBudgetOutput, GetListInput } from 'models/transaction';
import { TransactionRepository, TransactionUseCase } from 'models/transaction';
import { TransactionRepositoryService } from 'repositories/postgres/transaction/transaction-repository.service';
import type { PaginatedItems } from 'types/paginated-items';

@Injectable()
export class TransactionService extends TransactionUseCase {
	constructor(
		@Inject(TransactionRepositoryService)
		private readonly transactionRepository: TransactionRepository,

		@Inject(UtilsAdapterService)
		private readonly utilsAdapter: UtilsAdapter,
	) {
		super();
	}

	async getList({
		accountId,
		budgetId,
		month,
		year,
		limit,
		page,
	}: GetListInput): Promise<PaginatedItems<GetByBudgetOutput>> {
		const { paging, ...pagParams } = this.utilsAdapter.pagination({
			limit,
			page,
		});

		const data = await this.transactionRepository.getByBudget({
			...pagParams,
			accountId,
			budgetId,
			month,
			year,
		});

		return {
			paging,
			data,
		};
	}
}

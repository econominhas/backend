import { Inject, Injectable } from '@nestjs/common';
import { UtilsAdapterImplementation } from 'src/adapters/implementations/utils.service';
import { UtilsAdapter } from 'src/adapters/utils';
import type { GetByBudgetOutput, GetListInput } from 'src/models/transaction';
import {
	TransactionRepository,
	TransactionUseCase,
} from 'src/models/transaction';
import { TransactionRepositoryService } from 'src/repositories/postgres/transaction/transaction-repository.service';
import type { PaginatedItems } from 'src/types/paginated-items';

@Injectable()
export class TransactionService extends TransactionUseCase {
	constructor(
		@Inject(TransactionRepositoryService)
		private readonly transactionRepository: TransactionRepository,

		@Inject(UtilsAdapterImplementation)
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

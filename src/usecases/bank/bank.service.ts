import { Inject, Injectable } from '@nestjs/common';
import type { BankAccount, BankProvider } from '@prisma/client';
import { UtilsAdapterImplementation } from 'src/adapters/implementations/utils.service';
import { UtilsAdapter } from 'src/adapters/utils';
import type { CreateInput } from 'src/models/bank';
import { BankUseCase } from 'src/models/bank';

import { BankRepositoryService } from 'src/repositories/postgres/bank/bank-repository.service';
import type { Paginated, PaginatedItems } from 'src/types/paginated-items';

@Injectable()
export class BankService extends BankUseCase {
	constructor(
		@Inject(BankRepositoryService)
		private readonly bankRepository: BankRepositoryService,

		@Inject(UtilsAdapterImplementation)
		private readonly utilsAdapter: UtilsAdapter,
	) {
		super();
	}

	async getProviders(i: Paginated): Promise<PaginatedItems<BankProvider>> {
		const { paging, ...pagParams } = this.utilsAdapter.pagination(i);

		const data = await this.bankRepository.getProviders(pagParams);

		return {
			paging,
			data,
		};
	}

	async create(i: CreateInput): Promise<BankAccount> {
		return this.bankRepository.create(i);
	}
}

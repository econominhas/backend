import { Inject, Injectable } from '@nestjs/common';
import type { BankAccount, BankProvider } from '@prisma/client';
import { UtilsAdapterService } from 'adapters/implementations/utils/utils.service';
import { UtilsAdapter } from 'adapters/utils';
import type { CreateInput } from 'models/bank';
import { BankUseCase } from 'models/bank';

import { BankRepositoryService } from 'repositories/postgres/bank/bank-repository.service';
import type { Paginated, PaginatedItems } from 'types/paginated-items';

@Injectable()
export class BankService extends BankUseCase {
	constructor(
		@Inject(BankRepositoryService)
		private readonly bankRepository: BankRepositoryService,

		@Inject(UtilsAdapterService)
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

import { Inject, Injectable } from '@nestjs/common';
import { BankProvider } from '@prisma/client';
import { UtilsAdapter } from 'src/adapters/implementations/utils.service';
import { BankUseCase, CreateInput } from 'src/models/bank';

import { BankRepositoryService } from 'src/repositories/postgres/bank/bank-repository.service';
import { Paginated, PaginatedItems } from 'src/types/paginated-items';

@Injectable()
export class BankService extends BankUseCase {
	constructor(
		@Inject(BankRepositoryService)
		private readonly bankRepository: BankRepositoryService,

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

	async create(i: CreateInput): Promise<void> {
		await this.bankRepository.create(i);
	}
}

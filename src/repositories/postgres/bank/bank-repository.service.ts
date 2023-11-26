import { Injectable } from '@nestjs/common';
import { InjectRepository, Repository } from '..';
import { BankProvider } from '@prisma/client';
import { PaginatedRepository } from 'src/types/paginated-items';
import { BankRepository } from 'src/models/bank';

@Injectable()
export class BankRepositoryService extends BankRepository {
	constructor(
		@InjectRepository('bankProvider')
		private readonly bankProviderRepository: Repository<'bankProvider'>,
	) {
		super();
	}

	getProviders({
		offset,
		limit,
	}: PaginatedRepository): Promise<Array<BankProvider>> {
		return this.bankProviderRepository.findMany({
			skip: offset,
			take: limit,
		});
	}
}

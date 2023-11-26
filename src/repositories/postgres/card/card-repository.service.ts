import { Injectable } from '@nestjs/common';
import { InjectRepository, Repository } from '..';
import { PaginatedRepository } from 'src/types/paginated-items';
import { CardRepository } from 'src/models/card';
import { CardProvider } from '@prisma/client';

@Injectable()
export class CardRepositoryService extends CardRepository {
	constructor(
		@InjectRepository('cardProvider')
		private readonly cardProviderRepository: Repository<'cardProvider'>,
	) {
		super();
	}

	getProviders({
		offset,
		limit,
	}: PaginatedRepository): Promise<Array<CardProvider>> {
		return this.cardProviderRepository.findMany({
			skip: offset,
			take: limit,
		});
	}
}

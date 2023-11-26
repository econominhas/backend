import { Inject, Injectable } from '@nestjs/common';
import { CardProvider } from '@prisma/client';
import { UtilsAdapter } from 'src/adapters/implementations/utils.service';
import { CardUseCase } from 'src/models/card';
import { CardRepositoryService } from 'src/repositories/postgres/card/card-repository.service';
import { Paginated, PaginatedItems } from 'src/types/paginated-items';

@Injectable()
export class CardService extends CardUseCase {
	constructor(
		@Inject(CardRepositoryService)
		private readonly cardRepository: CardRepositoryService,

		private readonly utilsAdapter: UtilsAdapter,
	) {
		super();
	}

	async getProviders(i: Paginated): Promise<PaginatedItems<CardProvider>> {
		const { paging, ...pagParams } = this.utilsAdapter.pagination(i);

		const data = await this.cardRepository.getProviders(pagParams);

		return {
			paging,
			data,
		};
	}
}

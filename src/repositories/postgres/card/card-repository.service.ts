import {
	ConflictException,
	Inject,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository, Repository } from '..';
import type { PaginatedRepository } from 'src/types/paginated-items';
import type { CreateInput, GetProviderInput } from 'src/models/card';
import { CardRepository } from 'src/models/card';
import type { Card, CardProvider } from '@prisma/client';
import { UIDAdapter } from 'src/adapters/implementations/uid.service';
import { IdAdapter } from 'src/adapters/id';

@Injectable()
export class CardRepositoryService extends CardRepository {
	constructor(
		@InjectRepository('cardProvider')
		private readonly cardProviderRepository: Repository<'cardProvider'>,
		@InjectRepository('card')
		private readonly cardRepository: Repository<'card'>,

		@Inject(UIDAdapter)
		private readonly idAdapter: IdAdapter,
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

	getProvider({ cardProviderId }: GetProviderInput): Promise<CardProvider> {
		return this.cardProviderRepository.findUnique({
			where: {
				id: cardProviderId,
			},
		});
	}

	async create({
		accountId,
		cardProviderId,
		name,
		lastFourDigits,
		dueDay,
		limit,
		balance,
	}: CreateInput): Promise<Card> {
		try {
			const cardAccount = await this.cardRepository.create({
				data: {
					id: this.idAdapter.gen(),
					accountId,
					cardProviderId,
					name,
					lastFourDigits,
					dueDay,
					limit,
					balance,
				},
			});

			return cardAccount;
		} catch (err) {
			// https://www.prisma.io/docs/reference/api-reference/error-reference#p2003
			if (err.code === 'P2003') {
				throw new NotFoundException("Card provider doesn't exists");
			}
			// https://www.prisma.io/docs/reference/api-reference/error-reference#p2004
			if (err.code === 'P2004') {
				throw new ConflictException('Card already exists');
			}

			throw new InternalServerErrorException(
				`Fail to create card: ${err.message}`,
			);
		}
	}
}

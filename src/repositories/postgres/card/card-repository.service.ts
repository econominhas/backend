import {
	ConflictException,
	Inject,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { InjectRaw, InjectRepository, RawPostgres, Repository } from '..';
import type { PaginatedRepository } from 'types/paginated-items';
import type {
	CreateInput,
	GetBalanceByUserInput,
	GetBalanceByUserOutput,
	GetByAccountIdAndTypeInput,
	GetByAccountIdAndTypeOutput,
	GetProviderInput,
	UpdateInput,
} from 'models/card';
import { CardRepository } from 'models/card';
import type { Card, CardProvider } from '@prisma/client';
import { CardTypeEnum } from '@prisma/client';
import { IdAdapter } from 'adapters/id';
import { UIDAdapterService } from 'adapters/implementations/uid/uid.service';

@Injectable()
export class CardRepositoryService extends CardRepository {
	constructor(
		@InjectRepository('cardProvider')
		private readonly cardProviderRepository: Repository<'cardProvider'>,
		@InjectRepository('card')
		private readonly cardRepository: Repository<'card'>,
		@InjectRaw()
		private readonly rawPostgres: RawPostgres,

		@Inject(UIDAdapterService)
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
					id: this.idAdapter.genId(),
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

	async getBalanceByUser({
		accountId,
	}: GetBalanceByUserInput): Promise<GetBalanceByUserOutput> {
		const r = await this.rawPostgres<
			Array<{
				type: CardTypeEnum;
				balance: number;
			}>
		>`
			SELECT
				sum(cards.balance) AS balance,
				card_providers.type as type
			FROM
				cards
			JOIN
				card_providers
			ON
				card_providers.id = cards.card_provider_id
			WHERE
				cards.account_id = ${accountId}
				AND
				card_providers.type IN ${[CardTypeEnum.VA, CardTypeEnum.VR, CardTypeEnum.VT]}
			GROUP BY
				card_providers.type;
		`;

		return r.reduce(
			(acc, cur) => {
				acc[cur.type] = cur.balance;

				return acc;
			},
			{} as Record<CardTypeEnum, number>,
		);
	}

	async update({ cardId, rtBillId }: UpdateInput): Promise<void> {
		await this.cardRepository.update({
			where: {
				id: cardId,
			},
			data: {
				rtBillId,
			},
		});
	}

	async getByAccountIdAndType({
		accountId,
		type,
		limit,
		offset,
	}: GetByAccountIdAndTypeInput): Promise<GetByAccountIdAndTypeOutput> {
		const cards = await this.cardRepository.findMany({
			select: {
				id: true,
				dueDay: true,
				cardProvider: {
					select: {
						statementDays: true,
					},
				},
			},
			where: {
				accountId,
				cardProvider: {
					type,
				},
			},
			skip: offset,
			take: limit,
		});

		return cards.map((c) => ({
			cardId: c.id,
			dueDay: c.dueDay,
			statementDays: c.cardProvider.statementDays,
		}));
	}
}

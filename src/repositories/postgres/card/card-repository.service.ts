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
	GetPostpaidInput,
	GetPostpaidOutput,
	GetProviderInput,
	UpdateInput,
} from 'models/card';
import { CardRepository } from 'models/card';
import type { Card, CardNetworkEnum, CardProvider } from '@prisma/client';
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

	async getPostpaid({
		accountId,
		date,
		limit,
		offset,
	}: GetPostpaidInput): Promise<GetPostpaidOutput> {
		const r = await this.rawPostgres<
			Array<{
				id: string;
				name: string;
				last_four_digits: string;
				icon_url: string;
				color: string;
				network: CardNetworkEnum;
				total: number;
				start_date: Date;
				end_date: Date;
				due_date: Date;
			}>
		>`
			SELECT
				c.id,
				c.name,
				c.last_four_digits,
				cp.icon_url,
				cp.color,
				cp.network,
				SUM(t.amount) AS total,
				cb.start_date,
				cb.end_date
				cb.due_date
			FROM
				cards c
			JOIN
				card_providers cp
			ON
				c.card_provider_id = cp.id
			JOIN
				card_bills cb
			ON
				c.id = cb.card_id
			JOIN
				installments i
			ON
				cb.id = i.card_bill_id
			JOIN
				transactions t
			ON
				i.transaction_id = t.id
			WHERE
				c.account_id = ${accountId}
			AND
				cp.type = ${CardTypeEnum.CREDIT}
			AND
				cb.start_date >= ${date}
			AND
				cb.end_date <= ${date}
			GROUP BY
				c.id
			ORDER BY
				c.name
			LIMIT ${limit}
			OFFSET ${offset};
		`;

		return r.map((data) => ({
			id: data.id,
			name: data.name,
			lastFourDigits: data.last_four_digits,
			provider: {
				iconUrl: data.icon_url,
				color: data.color,
				network: data.network,
			},
			bill: {
				total: data.total,
				startDate: data.start_date,
				endDate: data.end_date,
				dueDate: data.due_date,
			},
		}));
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
}

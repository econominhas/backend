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
	GetBillsToBePaidInput,
	GetBillsToBePaidOutput,
	GetByIdInput,
	GetByIdOutput,
	GetPostpaidInput,
	GetPostpaidOutput,
	GetPrepaidInput,
	GetPrepaidOutput,
	GetProviderInput,
	UpdateBalanceInput,
	UpsertManyBillsInput,
} from 'models/card';
import { CardRepository } from 'models/card';
import type { Card, CardNetworkEnum, CardProvider } from '@prisma/client';
import { CardTypeEnum, PayAtEnum } from '@prisma/client';
import { IdAdapter } from 'adapters/id';
import { UIDAdapterService } from 'adapters/implementations/uid/uid.service';
import { DateAdapter } from 'adapters/date';
import { DayjsAdapterService } from 'adapters/implementations/dayjs/dayjs.service';

@Injectable()
export class CardRepositoryService extends CardRepository {
	constructor(
		@InjectRepository('cardProvider')
		private readonly cardProviderRepository: Repository<'cardProvider'>,
		@InjectRepository('card')
		private readonly cardRepository: Repository<'card'>,
		@InjectRepository('cardBill')
		private readonly cardBillRepository: Repository<'cardBill'>,
		@InjectRaw()
		private readonly rawPostgres: RawPostgres,

		@Inject(UIDAdapterService)
		private readonly idAdapter: IdAdapter,
		@Inject(DayjsAdapterService)
		private readonly dateAdapter: DateAdapter,
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

	getById({ cardId }: GetByIdInput): Promise<GetByIdOutput> {
		return this.cardRepository.findUnique({
			where: {
				id: cardId,
			},
			include: {
				cardProvider: true,
			},
		});
	}

	async getBalanceByUser({
		accountId,
	}: GetBalanceByUserInput): Promise<GetBalanceByUserOutput> {
		const r = await this.rawPostgres<
			Array<{
				card_provider_type: CardTypeEnum;
				total_balance: number;
			}>
		>`
			SELECT
				cp.type AS card_provider_type,
				SUM(c.balance) AS total_balance
			FROM
				cards c
			JOIN
				card_providers cp ON c.card_provider_id = cp.id
			WHERE
				c.account_id = ${accountId}
			AND
				cp.type IN ${[CardTypeEnum.VA, CardTypeEnum.VR, CardTypeEnum.VT]}
			GROUP BY
				cp.type
			ORDER BY
				cp.type ASC;
		`;

		return r.reduce(
			(acc, cur) => {
				acc[cur.card_provider_type] = cur.total_balance;

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
	}: GetPostpaidInput): Promise<Array<GetPostpaidOutput>> {
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
				statement_date: Date;
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
				statementDate: data.statement_date,
				dueDate: data.due_date,
			},
		}));
	}

	async getPrepaid({
		accountId,
		limit,
		offset,
	}: GetPrepaidInput): Promise<GetPrepaidOutput[]> {
		const r = await this.cardRepository.findMany({
			where: {
				accountId,
				cardProvider: {
					type: {
						in: [CardTypeEnum.VA, CardTypeEnum.VR, CardTypeEnum.VT],
					},
				},
			},
			select: {
				id: true,
				name: true,
				lastFourDigits: true,
				balance: true,
				cardProvider: {
					select: {
						iconUrl: true,
						color: true,
						network: true,
					},
				},
			},
			take: limit,
			skip: offset,
		});

		return r.map(({ cardProvider, ...card }) => ({
			...card,
			provider: cardProvider,
		}));
	}

	async getBillsToBePaid({
		accountId,
		startDate,
		endDate,
		limit,
		offset,
	}: GetBillsToBePaidInput): Promise<Array<GetBillsToBePaidOutput>> {
		const r = await this.rawPostgres<
			Array<{
				id: string;
				name: string;
				pay_at: PayAtEnum;
				last_four_digits: string;
				icon_url: string;
				color: string;
				network: CardNetworkEnum;
				total: number;
				statement_date: Date;
				due_date: Date;
			}>
		>`
			SELECT
				c.id,
				c.name,
				c.pay_at,
				c.last_four_digits,
				cp.icon_url,
				cp.color,
				cp.network,
				SUM(t.amount) AS total,
				cb.statement_date,
				cb.due_date
			FROM
				cards c
			JOIN
				card_providers cp ON c.card_provider_id = cp.id
			JOIN
				card_bills cb ON c.id = cb.card_id
			JOIN
				installments i ON cb.id = i.card_bill_id
			JOIN
				transactions t ON i.transaction_id = t.id
			WHERE
				c.account_id = ${accountId}
				AND cp.type = ${CardTypeEnum.CREDIT}
				AND (
					(c.pay_at = ${PayAtEnum.STATEMENT} AND cb.statement_date >= ${startDate} AND cb.statement_date <= ${endDate}
					OR (c.pay_at = ${PayAtEnum.DUE} AND cb.due_date >= ${startDate} AND cb.due_date <= ${endDate}
				)
				AND cb.paid_at IS NULL
			GROUP BY c.id
			ORDER BY
				CASE
					WHEN c.pay_at = ${PayAtEnum.STATEMENT} THEN cb.statement_date
					WHEN c.pay_at = ${PayAtEnum.DUE} THEN cb.due_date
					ELSE NULL
				END DESC
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
				payAt: data.pay_at,
				statementDate: data.statement_date,
				dueDate: data.due_date,
			},
		}));
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

	async updateBalance({
		cardId,
		increment,
	}: UpdateBalanceInput): Promise<void> {
		await this.cardRepository.update({
			where: {
				id: cardId,
				cardProvider: {
					type: {
						in: [CardTypeEnum.VA, CardTypeEnum.VR, CardTypeEnum.VT],
					},
				},
			},
			data: {
				balance: {
					increment,
				},
			},
		});
	}

	async upsertManyBills(i: UpsertManyBillsInput[]): Promise<void> {
		await this.cardBillRepository.createMany({
			data: i.map((cardBill) => ({
				...cardBill,
				id: this.idAdapter.genId(),
			})),
			skipDuplicates: true,
		});
	}
}

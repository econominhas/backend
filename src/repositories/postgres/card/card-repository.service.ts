import {
	ConflictException,
	Inject,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from "@nestjs/common";
import {
	type Card,
	type CardBill,
	type CardNetworkEnum,
	type CardProvider,
	CardTypeEnum,
	CardVariantEnum,
	PayAtEnum,
} from "@prisma/client";

import {
	CardRepository,
	type CreateInput,
	type GetBalanceByUserInput,
	type GetBalanceByUserOutput,
	type GetBillsToBePaidInput,
	type GetBillsToBePaidOutput,
	type GetByIdInput,
	type GetByIdOutput,
	type GetPostpaidInput,
	type GetPostpaidOutput,
	type GetPrepaidInput,
	type GetPrepaidOutput,
	type GetProviderInput,
	type UpdateBalanceInput,
	type UpsertManyBillsInput,
} from "models/card";
import { IdAdapter } from "adapters/id";
import { type PaginatedRepository } from "types/paginated-items";
import { UlidAdapterService } from "adapters/implementations/ulid/ulid.service";

import { InjectRaw, InjectRepository, RawPostgres, Repository } from "..";

@Injectable()
export class CardRepositoryService extends CardRepository {
	constructor(
		@InjectRepository("cardProvider")
		private readonly cardProviderRepository: Repository<"cardProvider">,
		@InjectRepository("card")
		private readonly cardRepository: Repository<"card">,
		@InjectRepository("cardBill")
		private readonly cardBillRepository: Repository<"cardBill">,
		@InjectRaw()
		private readonly rawPostgres: RawPostgres,

		@Inject(UlidAdapterService)
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

	getById({ cardId, accountId }: GetByIdInput): Promise<GetByIdOutput> {
		return this.cardRepository.findUnique({
			where: {
				id: cardId,
				accountId,
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
				variant: CardVariantEnum;
				balance: number;
			}>
		>`
			SELECT
				cp.type AS variant,
				SUM(c.balance) AS balance
			FROM
				cards c
			JOIN
				card_providers cp ON c.card_provider_id = cp.id
			WHERE
				c.account_id = ${accountId}
			AND
				cp.variant IN ${[CardVariantEnum.VA, CardVariantEnum.VT]}
			GROUP BY
				cp.variant
			ORDER BY
				cp.variant ASC;
		`;

		return r.reduce(
			(acc, cur) => {
				acc[cur.variant] = cur.balance;

				return acc;
			},
			{} as Record<CardVariantEnum, number>,
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

		return r.map(data => ({
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
	}: GetPrepaidInput): Promise<Array<GetPrepaidOutput>> {
		const r = await this.cardRepository.findMany({
			where: {
				accountId,
				cardProvider: {
					variant: {
						in: [CardVariantEnum.VA, CardVariantEnum.VT],
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

		return r.map(data => ({
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

	create({
		accountId,
		cardProviderId,
		name,
		lastFourDigits,
		dueDay,
		limit,
		balance,
	}: CreateInput): Promise<Card> {
		try {
			return this.cardRepository.create({
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
		} catch (err) {
			// https://www.prisma.io/docs/reference/api-reference/error-reference#p2003
			if (err.code === "P2003") {
				throw new NotFoundException("Card provider doesn't exists");
			}
			// https://www.prisma.io/docs/reference/api-reference/error-reference#p2004
			if (err.code === "P2004") {
				throw new ConflictException("Card already exists");
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
					variant: {
						in: [CardVariantEnum.VA, CardVariantEnum.VT],
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

	async upsertManyBills(
		i: Array<UpsertManyBillsInput>,
	): Promise<Array<CardBill>> {
		const cardId = i[0]?.cardId;

		if (!cardId) {
			return [];
		}

		const alreadyExistentMonths = await this.cardBillRepository
			.findMany({
				where: {
					cardId,
					month: {
						in: i.map(cb => cb.month),
					},
				},
				select: {
					month: true,
				},
			})
			.then(r => r.map(cb => cb.month.toISOString()));

		const cardBills = i.filter(
			cb => !alreadyExistentMonths.includes(cb.month.toISOString()),
		);

		await this.cardBillRepository.createMany({
			data: cardBills.map(cardBill => ({
				...cardBill,
				id: this.idAdapter.genId(),
			})),
			skipDuplicates: true,
		});

		return this.cardBillRepository.findMany({
			where: {
				cardId,
				month: {
					in: i.map(cb => cb.month),
				},
			},
			orderBy: {
				month: "asc",
			},
		});
	}
}

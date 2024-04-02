import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { CardTypeEnum, type CardBill, type CardProvider } from "@prisma/client";

import { DateAdapter } from "adapters/date";
import { DayjsAdapterService } from "adapters/implementations/dayjs/dayjs.service";
import { UtilsAdapterService } from "adapters/implementations/utils/utils.service";
import { UtilsAdapter } from "adapters/utils";
import {
	CardRepository,
	CardUseCase,
	type CreateInput,
	type CreateNextCardBillsInput,
	type GetBillsToBePaidOutput,
	type GetCardBillsToBePaidInput,
	type GetPostpaidCardsInput,
	type GetPostpaidOutput,
	type GetPrepaidCardsInput,
	type GetPrepaidOutput,
} from "models/card";
import { CardRepositoryService } from "repositories/postgres/card/card-repository.service";
import { type Paginated, type PaginatedItems } from "types/paginated-items";

interface GetCurBillDataInput {
	dueDay: number;
	statementDays: number;
}

interface GetBillDatesInput {
	dueDate: Date;
	statementDays: number;
}

interface GetBillDatesOutput {
	month: Date;
	statementDate: Date;
	dueDate: Date;
	startAt: Date;
	endAt: Date;
}

interface GetNextBillsDatesInput {
	initialDueDate: Date;
	statementDays: number;
	amount: number;
}

@Injectable()
export class CardService extends CardUseCase {
	constructor(
		@Inject(CardRepositoryService)
		private readonly cardRepository: CardRepository,

		@Inject(UtilsAdapterService)
		private readonly utilsAdapter: UtilsAdapter,
		@Inject(DayjsAdapterService)
		private readonly dateAdapter: DateAdapter,
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

	async create(i: CreateInput): Promise<void> {
		const provider = await this.cardRepository.getProvider({
			cardProviderId: i.cardProviderId,
		});

		if (!provider) {
			throw new NotFoundException("Card provider doesn't exists");
		}

		if (this.isPostpaid(provider.type)) {
			this.validatePostpaid(i);
		}

		if (this.isPrepaid(provider.type)) {
			this.validatePrepaid(i);
		}

		await this.cardRepository.create(i);
	}

	async getPostpaid({
		accountId,
		date,
		...pagination
	}: GetPostpaidCardsInput): Promise<PaginatedItems<GetPostpaidOutput>> {
		const { limit, offset, paging } = this.utilsAdapter.pagination(pagination);

		const data = await this.cardRepository.getPostpaid({
			accountId,
			date,
			limit,
			offset,
		});

		return {
			paging,
			data,
		};
	}

	async getPrepaid({
		accountId,
		...pagination
	}: GetPrepaidCardsInput): Promise<PaginatedItems<GetPrepaidOutput>> {
		const { limit, offset, paging } = this.utilsAdapter.pagination(pagination);

		const data = await this.cardRepository.getPrepaid({
			accountId,
			limit,
			offset,
		});

		return {
			paging,
			data,
		};
	}

	async getBillsToBePaid({
		accountId,
		date,
		...pagination
	}: GetCardBillsToBePaidInput): Promise<
		PaginatedItems<GetBillsToBePaidOutput>
	> {
		const { limit, offset, paging } = this.utilsAdapter.pagination(pagination);

		const endDate = this.dateAdapter.endOf(date, "month");

		const data = await this.cardRepository.getBillsToBePaid({
			accountId,
			startDate: date,
			endDate,
			limit,
			offset,
		});

		return {
			paging,
			data,
		};
	}

	async createNextCardBills({
		cardId,
		accountId,
		amount,
	}: CreateNextCardBillsInput): Promise<Array<CardBill>> {
		const card = await this.cardRepository.getById({
			cardId,
			accountId,
		});

		if (!card) {
			throw new BadRequestException("Invalid card");
		}

		const curBillDueDate = this.getCurBillDueDate({
			dueDay: card.dueDay,
			statementDays: card.cardProvider.statementDays,
		});

		const allBillsData = this.getNextBillsDates({
			initialDueDate: curBillDueDate,
			statementDays: card.cardProvider.statementDays,
			amount,
		});

		return this.cardRepository.upsertManyBills(
			allBillsData.map(billDates => ({
				...billDates,
				cardId,
			})),
		);
	}

	// Private

	private isPostpaid(type: CardTypeEnum) {
		return [CardTypeEnum.CREDIT].includes(type as any);
	}

	private isPrepaid(type: CardTypeEnum) {
		return [CardTypeEnum.BENEFIT].includes(type as any);
	}

	private validatePostpaid(i: CreateInput) {
		if (typeof i.dueDay === "undefined" || typeof i.limit === "undefined") {
			throw new BadRequestException(
				'Postpaid cards must have "dueDay" and "limit"',
			);
		}
		if (typeof i.balance !== "undefined") {
			throw new BadRequestException('Postpaid cards can\'t have "balance"');
		}
		if (
			(typeof i.payAt !== "undefined" && typeof i.payWithId === "undefined") ||
			(typeof i.payAt === "undefined" && typeof i.payWithId !== "undefined")
		) {
			throw new BadRequestException(
				'Both "payAt" and "payWithId" must exist or not exist',
			);
		}
	}

	private validatePrepaid(i: CreateInput) {
		if (typeof i.balance === "undefined") {
			throw new BadRequestException('Prepaid cards must have "balance"');
		}
		if (typeof i.dueDay !== "undefined" || typeof i.limit !== "undefined") {
			throw new BadRequestException(
				'Prepaid cards can\'t have "dueDay" and "limit"',
			);
		}
		if (typeof i.payAt !== "undefined" || typeof i.payWithId !== "undefined") {
			throw new BadRequestException(
				'Only postpaid cards can have "payAt" and "payWithId"',
			);
		}
	}

	private getCurBillDueDate({
		dueDay,
		statementDays,
	}: GetCurBillDataInput): Date {
		const statementDate = this.dateAdapter.statementDate(dueDay, statementDays);

		// If the statementDay is after the current day
		if (this.dateAdapter.isAfterToday(statementDate)) {
			return this.dateAdapter.dueDate(dueDay);
		}

		/*
		 * If the statementDay is BEFORE the current day,
		 * the dueDate is in the next month
		 */
		return this.dateAdapter.dueDate(dueDay, 1);
	}

	private getNextBillsDates({
		initialDueDate,
		statementDays,
		amount,
	}: GetNextBillsDatesInput) {
		const billsDates: Array<GetBillDatesOutput> = [];

		const curDueDate = initialDueDate;
		do {
			const billDates = this.getBillDates({
				dueDate: curDueDate,
				statementDays,
			});

			billsDates.push(billDates);
		} while (billsDates.length < amount);

		return billsDates;
	}

	private getBillDates({
		dueDate,
		statementDays,
	}: GetBillDatesInput): GetBillDatesOutput {
		return {
			// First day of the month
			month: this.dateAdapter.startOf(dueDate, "month"),

			// StartOfDay: curDueDate - statementDays
			statementDate: this.dateAdapter.startOf(
				this.dateAdapter.sub(dueDate, statementDays, "day"),
				"day",
			),

			// EndOfDay: curDueDate
			dueDate: this.dateAdapter.endOf(dueDate, "day"),

			// StartOfDay: prevDueDate - statementDays
			startAt: this.dateAdapter.startOf(
				this.dateAdapter.sub(
					this.dateAdapter.sub(dueDate, 1, "month"),
					statementDays,
					"day",
				),
				"day",
			),

			/*
			 * EndOfDay: curDueDate - (statementDays + 1)
			 * *: Because when statementDate, cardBill is already closed
			 */
			endAt: this.dateAdapter.endOf(
				this.dateAdapter.sub(dueDate, statementDays + 1, "day"),
				"day",
			),
		};
	}
}

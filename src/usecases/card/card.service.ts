import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import type { CardProvider } from '@prisma/client';
import { CardTypeEnum } from '@prisma/client';
import type { YearMonth } from 'adapters/date';
import { DateAdapter } from 'adapters/date';
import { DayjsAdapterService } from 'adapters/implementations/dayjs/dayjs.service';
import { UtilsAdapterService } from 'adapters/implementations/utils/utils.service';
import { UtilsAdapter } from 'adapters/utils';
import type {
	CreateInput,
	GetBillsToBePaidOutput,
	GetCardBillsToBePaidInput,
	GetPostpaidCardsInput,
	GetPostpaidOutput,
	GetPrepaidCardsInput,
	GetPrepaidOutput,
	UpsertCardBillsInput,
} from 'models/card';
import { CardRepository, CardUseCase } from 'models/card';
import { CardRepositoryService } from 'repositories/postgres/card/card-repository.service';
import type { Paginated, PaginatedItems } from 'types/paginated-items';

interface GetBillStartDateInput {
	month: YearMonth;
	dueDay: number;
	statementDays: number;
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
			if (typeof i.dueDay === 'undefined' || typeof i.limit === 'undefined') {
				throw new BadRequestException(
					'Postpaid cards must have "dueDay" and "limit"',
				);
			}
			if (typeof i.balance !== 'undefined') {
				throw new BadRequestException('Postpaid cards can\'t have "balance"');
			}
			if (
				(typeof i.payAt !== 'undefined' &&
					typeof i.payWithId === 'undefined') ||
				(typeof i.payAt === 'undefined' && typeof i.payWithId !== 'undefined')
			) {
				throw new BadRequestException(
					'Both "payAt" and "payWithId" must exist or not exist',
				);
			}
		}

		if (this.isPrepaid(provider.type)) {
			if (typeof i.balance === 'undefined') {
				throw new BadRequestException('Prepaid cards must have "balance"');
			}
			if (typeof i.dueDay !== 'undefined' || typeof i.limit !== 'undefined') {
				throw new BadRequestException(
					'Prepaid cards can\'t have "dueDay" and "limit"',
				);
			}
			if (
				typeof i.payAt !== 'undefined' ||
				typeof i.payWithId !== 'undefined'
			) {
				throw new BadRequestException(
					'Only postpaid cards can have "payAt" and "payWithId"',
				);
			}
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

		const endDate = this.dateAdapter.endOf(date, 'month');

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

	async upsertCardBills({
		cardId,
		startDate,
		endDate,
	}: UpsertCardBillsInput): Promise<void> {
		const card = await this.cardRepository.getById({
			cardId,
		});

		if (!card) {
			throw new NotFoundException('Card not found');
		}

		const monthsBetween = this.dateAdapter.getMonthsBetween(startDate, endDate);

		await this.cardRepository.upsertManyBills(
			monthsBetween.map((month) => {
				const date = `${month}-01`;

				const { startAt, endAt, statementDate, dueDate } = this.getBillDates({
					month,
					statementDays: card.cardProvider.statementDays,
					dueDay: card.dueDay,
				});

				return {
					cardId,
					month: date,
					startAt,
					endAt,
					statementDate,
					dueDate,
				};
			}),
		);
	}

	// Private

	private isPostpaid(type: CardTypeEnum) {
		return [CardTypeEnum.CREDIT].includes(type as any);
	}

	private isPrepaid(type: CardTypeEnum) {
		return [CardTypeEnum.VA, CardTypeEnum.VR, CardTypeEnum.VT].includes(
			type as any,
		);
	}

	private getBillDates({
		month,
		dueDay,
		statementDays,
	}: GetBillStartDateInput) {
		const curDueDate = `${month}-${dueDay}`;

		return {
			// startOfDay: curDueDate - statementDays
			statementDate: this.dateAdapter.startOf(
				this.dateAdapter.sub(curDueDate, statementDays, 'day'),
				'day',
			),

			// endOfDay: curDueDate
			dueDate: this.dateAdapter.endOf(curDueDate, 'day'),

			// startOfDay: prevDueDate - statementDays
			startAt: this.dateAdapter.startOf(
				this.dateAdapter.sub(
					this.dateAdapter.sub(curDueDate, 1, 'month'),
					statementDays,
					'day',
				),
				'day',
			),

			// endOfDay: curDueDate - (statementDays + 1)
			// *: Because when statementDate, cardBill is already closed
			endAt: this.dateAdapter.endOf(
				this.dateAdapter.sub(curDueDate, statementDays + 1, 'day'),
				'day',
			),
		};
	}
}

import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import type { CardProvider } from '@prisma/client';
import { CardTypeEnum } from '@prisma/client';
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
} from 'models/card';
import { CardRepository, CardUseCase } from 'models/card';
import { CardRepositoryService } from 'repositories/postgres/card/card-repository.service';
import type { Paginated, PaginatedItems } from 'types/paginated-items';

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

		const endDate = this.dateAdapter.endOfMonth(date);

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

	// Private

	private isPostpaid(type: CardTypeEnum) {
		return [CardTypeEnum.CREDIT].includes(type as any);
	}

	private isPrepaid(type: CardTypeEnum) {
		return [CardTypeEnum.VA, CardTypeEnum.VR, CardTypeEnum.VT].includes(
			type as any,
		);
	}
}

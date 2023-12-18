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
	AllCardBillsInput,
	AllCardBillsOutput,
	CreateCardInput,
} from 'models/card';
import { CardRepository, CardUseCase } from 'models/card';
import { RecurrentTransactionUseCase } from 'models/recurrent-transaction';
import { TransactionRepository } from 'models/transaction';
import { CardRepositoryService } from 'repositories/postgres/card/card-repository.service';
import { TransactionRepositoryService } from 'repositories/postgres/transaction/transaction-repository.service';
import type { Paginated, PaginatedItems } from 'types/paginated-items';
import { RecurrentTransactionService } from 'usecases/recurrent-transaction/recurrent-transaction.service';

@Injectable()
export class CardService extends CardUseCase {
	constructor(
		@Inject(CardRepositoryService)
		private readonly cardRepository: CardRepository,
		@Inject(TransactionRepositoryService)
		private readonly transactionRepository: TransactionRepository,

		@Inject(RecurrentTransactionService)
		private readonly recurrentTransactionService: RecurrentTransactionUseCase,

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

	async create(i: CreateCardInput): Promise<void> {
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
		}

		const card = await this.cardRepository.create(i);

		// Creates the recurrent transaction to pay the bill of the credit card
		if (
			this.isPostpaid(provider.type) &&
			i.bankAccountId &&
			i.budgetId &&
			i.payAt
		) {
			const recurrentTransaction =
				await this.recurrentTransactionService.createCreditCardBill({
					accountId: i.accountId,
					bankAccountId: i.bankAccountId,
					card: card,
					budgetId: i.budgetId,
					dueDay: i.dueDay,
					statementDays: provider.statementDays,
					payAt: i.payAt,
				});

			await this.cardRepository.update({
				cardId: card.id,
				rtBillId: recurrentTransaction.id,
			});
		}
	}

	async allCardsBills({
		accountId,
	}: AllCardBillsInput): Promise<AllCardBillsOutput> {
		const cards = await this.cardRepository.getByAccountIdAndType({
			accountId,
			type: CardTypeEnum.CREDIT,
			limit: 100000,
			offset: 0,
		});

		let dateFrom: Date;
		let dateTo: Date;
		const cardsIds: Array<string> = [];
		const cardsWithStatementDates = cards.reduce(
			(acc, cur) => {
				const { start, end } = this.dateAdapter.getStatementDates({
					initialDate: new Date(),
					dueDay: cur.dueDay,
					statementDays: cur.statementDays,
				});

				if (this.dateAdapter.isBefore(start, dateFrom)) {
					dateFrom = start;
				}

				if (this.dateAdapter.isAfter(end, dateTo)) {
					dateTo = end;
				}

				cardsIds.push(cur.cardId);

				acc[cur.cardId] = {
					cardId: cur.cardId,
					billFromDate: dateFrom,
					billToDate: dateTo,
					amount: 0,
				};

				return acc;
			},
			{} as Record<string, AllCardBillsOutput[0]>,
		);

		const transactions =
			await this.transactionRepository.getByCardIdBetweenDates({
				cardsIds,
				dateFrom,
				dateTo,
				limit: 100000,
				offset: 0,
			});

		// ALERT This for changes the value of cardsWithStatementDates!
		for (const transaction of transactions) {
			const cardData = cardsWithStatementDates[transaction.cardId!];

			/**
			 * Since we search all transactions from all cards,
			 * using the earliest start date, we may get transactions that
			 * should not be included in the card bill, because of this
			 * we need to filter it this way
			 */
			if (
				this.dateAdapter.isBetween(
					transaction.createdAt,
					cardData.billFromDate,
					cardData.billToDate,
				)
			) {
				cardsWithStatementDates[transaction.cardId!].amount +=
					transaction.amount;
			}
		}

		return Object.values(cardsWithStatementDates);
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

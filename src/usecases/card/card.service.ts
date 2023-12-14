import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import type { CardProvider } from '@prisma/client';
import { CardTypeEnum } from '@prisma/client';
import { UtilsAdapterService } from 'adapters/implementations/utils/utils.service';
import { UtilsAdapter } from 'adapters/utils';
import type { CreateCardInput } from 'models/card';
import { CardRepository, CardUseCase } from 'models/card';
import { RecurrentTransactionUseCase } from 'models/recurrent-transaction';
import { CardRepositoryService } from 'repositories/postgres/card/card-repository.service';
import type { Paginated, PaginatedItems } from 'types/paginated-items';
import { RecurrentTransactionService } from 'usecases/recurrent-transaction/recurrent-transaction.service';

@Injectable()
export class CardService extends CardUseCase {
	constructor(
		@Inject(CardRepositoryService)
		private readonly cardRepository: CardRepository,

		@Inject(RecurrentTransactionService)
		private readonly recurrentTransactionService: RecurrentTransactionUseCase,

		@Inject(UtilsAdapterService)
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

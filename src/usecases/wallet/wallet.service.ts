import { Inject, Injectable } from '@nestjs/common';
import { CardTypeEnum } from '@prisma/client';
import { BankRepository } from 'src/models/bank';
import { CardRepository } from 'src/models/card';
import type {
	BalanceOverviewInput,
	BalanceOverviewOutput,
} from 'src/models/wallet';
import { WalletUseCase } from 'src/models/wallet';

import { BankRepositoryService } from 'src/repositories/postgres/bank/bank-repository.service';
import { CardRepositoryService } from 'src/repositories/postgres/card/card-repository.service';

@Injectable()
export class WalletService extends WalletUseCase {
	constructor(
		@Inject(BankRepositoryService)
		private readonly bankRepository: BankRepository,
		@Inject(CardRepositoryService)
		private readonly cardRepository: CardRepository,
	) {
		super();
	}

	async balanceOverview(
		i: BalanceOverviewInput,
	): Promise<BalanceOverviewOutput> {
		const [bankBalance, cardsBalance] = await Promise.all([
			this.bankRepository.getBalanceByUser(i),
			this.cardRepository.getBalanceByUser(i),
		]);

		return {
			bankAccountBalance: bankBalance,
			vaBalance: cardsBalance[CardTypeEnum.VA],
			vrBalance: cardsBalance[CardTypeEnum.VR],
			vtBalance: cardsBalance[CardTypeEnum.VT],
		};
	}
}

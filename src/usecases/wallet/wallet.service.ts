import { Inject, Injectable } from '@nestjs/common';
import { CardVariantEnum } from '@prisma/client';
import { BankRepository } from 'models/bank';
import { CardRepository } from 'models/card';
import type {
	BalanceOverviewInput,
	BalanceOverviewOutput,
} from 'models/wallet';
import { WalletUseCase } from 'models/wallet';

import { BankRepositoryService } from 'repositories/postgres/bank/bank-repository.service';
import { CardRepositoryService } from 'repositories/postgres/card/card-repository.service';

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
			vaBalance: cardsBalance[CardVariantEnum.VA],
			vrBalance: cardsBalance[CardVariantEnum.VR],
			vtBalance: cardsBalance[CardVariantEnum.VT],
		};
	}
}

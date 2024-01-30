import { Module } from '@nestjs/common';
import { RecurrentTransactionService } from './recurrent-transaction.service';
import { RecurrentTransactionRepositoryModule } from 'repositories/postgres/recurrent-transaction/recurrent-transaction-repository.module';
import { RecurrentTransactionController } from 'delivery/recurrent-transaction.controller';
import { DayJsAdapterModule } from 'adapters/implementations/dayjs/dayjs.module';
import { FormulasModule } from './utils/formula/formula.module';
import { MatchingDatesModule } from './utils/matching-dates/matching-dates.module';
import { BudgetModule } from 'usecases/budget/budget.module';
import { UtilsAdapterModule } from 'adapters/implementations/utils/utils.module';
import { TransactionModule } from 'usecases/transaction/transaction.module';

@Module({
	controllers: [RecurrentTransactionController],
	imports: [
		RecurrentTransactionRepositoryModule,

		TransactionModule,
		BudgetModule,

		MatchingDatesModule,
		FormulasModule,

		DayJsAdapterModule,
		UtilsAdapterModule,
	],
	providers: [RecurrentTransactionService],
	exports: [RecurrentTransactionService],
})
export class RecurrentTransactionModule {}

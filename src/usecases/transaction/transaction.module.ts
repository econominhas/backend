import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionRepositoryModule } from 'repositories/postgres/transaction/transaction-repository.module';
import { TransactionController } from 'delivery/transaction.controller';
import { UtilsAdapterModule } from 'adapters/implementations/utils/utils.module';
import { BankModule } from 'usecases/bank/bank.module';
import { BankRepositoryModule } from 'repositories/postgres/bank/bank-repository.module';
import { BudgetRepositoryModule } from 'repositories/postgres/budget/budget-repository.module';
import { CategoryRepositoryModule } from 'repositories/postgres/category/category-repository.module';

@Module({
	controllers: [TransactionController],
	imports: [
		TransactionRepositoryModule,
		BankRepositoryModule,
		BudgetRepositoryModule,
		CategoryRepositoryModule,
		BankModule,
		UtilsAdapterModule,
	],
	providers: [TransactionService],
	exports: [TransactionService],
})
export class TransactionModule {}

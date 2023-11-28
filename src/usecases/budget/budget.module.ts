import { Module } from '@nestjs/common';
import { BudgetRepositoryModule } from 'src/repositories/postgres/budget/budget-repository.module';
import { BudgetService } from './budget.service';
import { BudgetController } from 'src/delivery/budget.controller';
import { AccountModule } from '../account/account.module';
import { TransactionRepositoryModule } from 'src/repositories/postgres/transaction/transaction-repository.module';
import { CategoryRepositoryModule } from 'src/repositories/postgres/category/category-repository.module';

@Module({
	controllers: [BudgetController],
	imports: [
		BudgetRepositoryModule,
		CategoryRepositoryModule,
		TransactionRepositoryModule,
		AccountModule,
	],
	providers: [BudgetService],
	exports: [BudgetService],
})
export class BudgetModule {}

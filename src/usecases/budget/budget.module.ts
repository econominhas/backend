import { Module } from '@nestjs/common';
import { BudgetRepositoryModule } from 'src/repositories/postgres/budget/budget-repository.module';
import { BudgetService } from './budget.service';
import { BudgetController } from 'src/delivery/budget.controller';
import { AccountModule } from '../account/account.module';

@Module({
	controllers: [BudgetController],
	imports: [BudgetRepositoryModule, AccountModule],
	providers: [BudgetService],
	exports: [BudgetService],
})
export class BudgetModule {}

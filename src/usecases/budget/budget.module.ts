import { Module } from '@nestjs/common';
import { BudgetRepositoryModule } from 'src/repositories/postgres/budget/budget-repository.module';
import { BudgetService } from './budget.service';
import { BudgetController } from 'src/delivery/budget.controller';

@Module({
	controllers: [BudgetController],
	imports: [BudgetRepositoryModule],
	providers: [BudgetService],
})
export class BudgetModule {}

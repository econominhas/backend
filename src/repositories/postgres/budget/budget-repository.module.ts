import { Module } from '@nestjs/common';
import { PostgresModule } from '..';
import { BudgetRepositoryService } from './budget-repository.service';
import { UIDAdapter } from 'src/adapters/implementations/uid.service';
import { DayjsAdapter } from 'src/adapters/implementations/dayjs.service';

@Module({
	imports: [PostgresModule.forFeature(['budget', 'budgetItem'])],
	providers: [BudgetRepositoryService, UIDAdapter, DayjsAdapter],
	exports: [BudgetRepositoryService],
})
export class BudgetRepositoryModule {}

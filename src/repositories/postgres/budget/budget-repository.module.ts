import { Module } from '@nestjs/common';
import { PostgresModule } from '..';
import { BudgetRepositoryService } from './budget-repository.service';
import { UIDAdapterModule } from 'adapters/implementations/uid/uid.module';

@Module({
	imports: [PostgresModule.forFeature(['budget']), UIDAdapterModule],
	providers: [BudgetRepositoryService],
	exports: [BudgetRepositoryService],
})
export class BudgetRepositoryModule {}

import { Module } from '@nestjs/common';
import { PostgresModule } from '..';
import { BudgetRepositoryService } from './budget-repository.service';
import { UIDAdapter } from 'src/adapters/implementations/uid.service';

@Module({
	imports: [PostgresModule.forFeature(['budget'])],
	providers: [BudgetRepositoryService, UIDAdapter],
	exports: [BudgetRepositoryService],
})
export class BudgetRepositoryModule {}

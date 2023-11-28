import { Module } from '@nestjs/common';
import { PostgresModule } from '..';
import { TransactionRepositoryService } from './transaction-repository.service';
import { DayjsAdapter } from 'src/adapters/implementations/dayjs.service';

@Module({
	imports: [PostgresModule.forFeature(['transaction'])],
	providers: [TransactionRepositoryService, DayjsAdapter],
	exports: [TransactionRepositoryService],
})
export class TransactionRepositoryModule {}

import { Module } from '@nestjs/common';
import { PostgresModule } from '..';
import { TransactionRepositoryService } from './transaction-repository.service';
import { UIDAdapterModule } from 'adapters/implementations/uid/uid.module';

@Module({
	imports: [PostgresModule.forFeature(['transaction']), UIDAdapterModule],
	providers: [TransactionRepositoryService],
	exports: [TransactionRepositoryService],
})
export class TransactionRepositoryModule {}

import { Module } from '@nestjs/common';
import { PostgresModule } from '..';
import { TransactionRepositoryService } from './transaction-repository.service';

@Module({
	imports: [PostgresModule.forFeature(['transaction'])],
	providers: [TransactionRepositoryService],
	exports: [TransactionRepositoryService],
})
export class TransactionRepositoryModule {}

import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionRepositoryModule } from 'repositories/postgres/transaction/transaction-repository.module';
import { TransactionController } from 'delivery/transaction.controller';
import { UtilsAdapterModule } from 'adapters/implementations/utils/utils.module';

@Module({
	controllers: [TransactionController],
	imports: [TransactionRepositoryModule, UtilsAdapterModule],
	providers: [TransactionService],
	exports: [TransactionService],
})
export class TransactionModule {}

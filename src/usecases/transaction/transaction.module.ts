import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionRepositoryModule } from 'src/repositories/postgres/transaction/transaction-repository.module';
import { TransactionController } from 'src/delivery/transaction.controller';
import { UtilsAdapterModule } from 'src/adapters/implementations/utils/utils.module';

@Module({
	controllers: [TransactionController],
	imports: [TransactionRepositoryModule, UtilsAdapterModule],
	providers: [TransactionService],
	exports: [TransactionService],
})
export class TransactionModule {}

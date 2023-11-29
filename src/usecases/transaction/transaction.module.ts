import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionRepositoryModule } from 'src/repositories/postgres/transaction/transaction-repository.module';
import { TransactionController } from 'src/delivery/transaction.controller';
import { UtilsAdapterImplementation } from 'src/adapters/implementations/utils.service';

@Module({
	controllers: [TransactionController],
	imports: [TransactionRepositoryModule],
	providers: [TransactionService, UtilsAdapterImplementation],
	exports: [TransactionService],
})
export class TransactionModule {}

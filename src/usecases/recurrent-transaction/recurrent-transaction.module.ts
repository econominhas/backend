import { Module } from '@nestjs/common';
import { RecurrentTransactionService } from './recurrent-transaction.service';
import { RecurrentTransactionRepositoryModule } from 'src/repositories/postgres/recurrent-transaction/recurrent-transaction-repository.module';
import { RecurrentTransactionController } from 'src/delivery/recurrent-transaction.controller';

@Module({
	controllers: [RecurrentTransactionController],
	imports: [RecurrentTransactionRepositoryModule],
	providers: [RecurrentTransactionService],
	exports: [RecurrentTransactionService],
})
export class RecurrentTransactionModule {}

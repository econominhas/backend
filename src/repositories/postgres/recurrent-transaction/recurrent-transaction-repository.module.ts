import { Module } from '@nestjs/common';
import { PostgresModule } from '..';
import { RecurrentTransactionRepositoryService } from './recurrent-transaction-repository.service';
import { UIDAdapter } from 'src/adapters/implementations/uid.service';

@Module({
	imports: [PostgresModule.forFeature(['recurrentTransaction'])],
	providers: [RecurrentTransactionRepositoryService, UIDAdapter],
	exports: [RecurrentTransactionRepositoryService],
})
export class RecurrentTransactionRepositoryModule {}

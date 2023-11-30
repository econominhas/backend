import { Module } from '@nestjs/common';
import { PostgresModule } from '..';
import { RecurrentTransactionRepositoryService } from './recurrent-transaction-repository.service';
import { UIDAdapterModule } from 'src/adapters/implementations/uid/uid.module';

@Module({
	imports: [
		PostgresModule.forFeature(['recurrentTransaction']),
		UIDAdapterModule,
	],
	providers: [RecurrentTransactionRepositoryService],
	exports: [RecurrentTransactionRepositoryService],
})
export class RecurrentTransactionRepositoryModule {}

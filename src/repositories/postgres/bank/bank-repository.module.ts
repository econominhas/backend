import { Module } from '@nestjs/common';
import { PostgresModule } from '..';
import { BankRepositoryService } from './bank-repository.service';
import { UIDAdapterModule } from 'adapters/implementations/uid/uid.module';

@Module({
	imports: [
		PostgresModule.forFeature(['bankProvider', 'bankAccount']),
		UIDAdapterModule,
	],
	providers: [BankRepositoryService],
	exports: [BankRepositoryService],
})
export class BankRepositoryModule {}

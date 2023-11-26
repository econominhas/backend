import { Module } from '@nestjs/common';
import { PostgresModule } from '..';
import { BankRepositoryService } from './bank-repository.service';
import { UIDAdapter } from 'src/adapters/implementations/uid.service';

@Module({
	imports: [PostgresModule.forFeature(['bankProvider', 'bankAccount'])],
	providers: [BankRepositoryService, UIDAdapter],
	exports: [BankRepositoryService],
})
export class BankRepositoryModule {}

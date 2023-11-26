import { Module } from '@nestjs/common';
import { PostgresModule } from '..';
import { BankRepositoryService } from './bank-repository.service';

@Module({
	imports: [PostgresModule.forFeature(['bankProvider'])],
	providers: [BankRepositoryService],
	exports: [BankRepositoryService],
})
export class BankRepositoryModule {}

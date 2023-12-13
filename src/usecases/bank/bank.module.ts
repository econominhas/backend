import { Module } from '@nestjs/common';
import { BankService } from './bank.service';
import { BankRepositoryModule } from 'repositories/postgres/bank/bank-repository.module';
import { BankController } from 'delivery/bank.controller';
import { UtilsAdapterModule } from 'adapters/implementations/utils/utils.module';

@Module({
	controllers: [BankController],
	imports: [BankRepositoryModule, UtilsAdapterModule],
	providers: [BankService],
	exports: [BankService],
})
export class BankModule {}

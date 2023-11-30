import { Module } from '@nestjs/common';
import { BankService } from './bank.service';
import { BankRepositoryModule } from 'src/repositories/postgres/bank/bank-repository.module';
import { BankController } from 'src/delivery/bank.controller';
import { UtilsAdapterModule } from 'src/adapters/implementations/utils/utils.module';

@Module({
	controllers: [BankController],
	imports: [BankRepositoryModule, UtilsAdapterModule],
	providers: [BankService],
	exports: [BankService],
})
export class BankModule {}

import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { BankRepositoryModule } from 'src/repositories/postgres/bank/bank-repository.module';
import { CardRepositoryModule } from 'src/repositories/postgres/card/card-repository.module';
import { WalletController } from 'src/delivery/wallet.controller';

@Module({
	controllers: [WalletController],
	imports: [BankRepositoryModule, CardRepositoryModule],
	providers: [WalletService],
	exports: [WalletService],
})
export class WalletModule {}

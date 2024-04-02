import { Module } from "@nestjs/common";

import { BankRepositoryModule } from "repositories/postgres/bank/bank-repository.module";
import { CardRepositoryModule } from "repositories/postgres/card/card-repository.module";
import { WalletController } from "delivery/wallet.controller";

import { WalletService } from "./wallet.service";

@Module({
	controllers: [WalletController],
	imports: [BankRepositoryModule, CardRepositoryModule],
	providers: [WalletService],
	exports: [WalletService],
})
export class WalletModule {}

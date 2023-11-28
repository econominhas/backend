import { Module } from "@nestjs/common";
import { UtilsAdapterImplementation } from "src/adapters/implementations/utils.service";
import { BankController } from "src/delivery/bank.controller";
import { BankRepositoryModule } from "src/repositories/postgres/bank/bank-repository.module";

import { BankService } from "./bank.service";

@Module({
	controllers: [BankController],
	imports: [BankRepositoryModule],
	providers: [BankService, UtilsAdapterImplementation],
	exports: [BankService],
})
export class BankModule {}

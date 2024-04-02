import { Module } from "@nestjs/common";

import { UIDAdapterModule } from "adapters/implementations/uid/uid.module";

import { PostgresModule } from "..";

import { BankRepositoryService } from "./bank-repository.service";

@Module({
	imports: [
		PostgresModule.forFeature(["bankProvider", "bankAccount"]),
		UIDAdapterModule,
	],
	providers: [BankRepositoryService],
	exports: [BankRepositoryService],
})
export class BankRepositoryModule {}

import { Module } from "@nestjs/common";

import { ULIDAdapterModule } from "adapters/implementations/ulid/ulid.module";

import { PostgresModule } from "..";

import { BankRepositoryService } from "./bank-repository.service";

@Module({
	imports: [
		PostgresModule.forFeature(["bankProvider", "bankAccount"]),
		ULIDAdapterModule,
	],
	providers: [BankRepositoryService],
	exports: [BankRepositoryService],
})
export class BankRepositoryModule {}

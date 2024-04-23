import { Module } from "@nestjs/common";

import { ULIDAdapterModule } from "adapters/implementations/ulid/ulid.module";

import { PostgresModule } from "..";

import { RecurrentTransactionRepositoryService } from "./recurrent-transaction-repository.service";

@Module({
	imports: [
		PostgresModule.forFeature(["recurrentTransaction"]),
		ULIDAdapterModule,
	],
	providers: [RecurrentTransactionRepositoryService],
	exports: [RecurrentTransactionRepositoryService],
})
export class RecurrentTransactionRepositoryModule {}

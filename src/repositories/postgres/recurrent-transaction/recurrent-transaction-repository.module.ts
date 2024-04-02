import { Module } from "@nestjs/common";

import { UIDAdapterModule } from "adapters/implementations/uid/uid.module";

import { PostgresModule } from "..";

import { RecurrentTransactionRepositoryService } from "./recurrent-transaction-repository.service";

@Module({
	imports: [
		PostgresModule.forFeature(["recurrentTransaction"]),
		UIDAdapterModule,
	],
	providers: [RecurrentTransactionRepositoryService],
	exports: [RecurrentTransactionRepositoryService],
})
export class RecurrentTransactionRepositoryModule {}

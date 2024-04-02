import { Module } from "@nestjs/common";

import { UIDAdapterModule } from "adapters/implementations/uid/uid.module";

import { PostgresModule } from "..";

import { TransactionRepositoryService } from "./transaction-repository.service";

@Module({
	imports: [PostgresModule.forFeature(["transaction"]), UIDAdapterModule],
	providers: [TransactionRepositoryService],
	exports: [TransactionRepositoryService],
})
export class TransactionRepositoryModule {}

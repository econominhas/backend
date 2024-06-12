import { Module } from "@nestjs/common";

import { ULIDAdapterModule } from "adapters/implementations/ulid/ulid.module";

import { PostgresModule } from "..";

import { TransactionRepositoryService } from "./transaction-repository.service";

@Module({
	imports: [PostgresModule.forFeature(["transaction"]), ULIDAdapterModule],
	providers: [TransactionRepositoryService],
	exports: [TransactionRepositoryService],
})
export class TransactionRepositoryModule {}

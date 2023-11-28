import { Module } from "@nestjs/common";

import { AccountRepositoryService } from "./account-repository.service";

import { PostgresModule } from "..";

@Module({
	imports: [PostgresModule.forFeature(["account", "config"])],
	providers: [AccountRepositoryService],
	exports: [AccountRepositoryService],
})
export class AccountRepositoryModule {}

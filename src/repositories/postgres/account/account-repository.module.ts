import { Module } from "@nestjs/common";

import { PostgresModule } from "..";

import { AccountRepositoryService } from "./account-repository.service";

@Module({
	imports: [PostgresModule.forFeature(["account", "config"])],
	providers: [AccountRepositoryService],
	exports: [AccountRepositoryService],
})
export class AccountRepositoryModule {}

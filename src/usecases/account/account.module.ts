import { Module } from "@nestjs/common";

import { AccountRepositoryModule } from "repositories/postgres/account/account-repository.module";
import { AccountController } from "delivery/account.controller";

import { AccountService } from "./account.service";

@Module({
	controllers: [AccountController],
	imports: [AccountRepositoryModule],
	providers: [AccountService],
	exports: [AccountService],
})
export class AccountModule {}

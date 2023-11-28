import { Module } from "@nestjs/common";
import { AccountController } from "src/delivery/account.controller";
import { AccountRepositoryModule } from "src/repositories/postgres/account/account-repository.module";

import { AccountService } from "./account.service";

@Module({
	controllers: [AccountController],
	imports: [AccountRepositoryModule],
	providers: [AccountService],
	exports: [AccountService],
})
export class AccountModule {}

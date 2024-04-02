import { Module } from "@nestjs/common";

import { AccountRepositoryModule } from "repositories/postgres/account/account-repository.module";
import { AccountController } from "delivery/account.controller";
import { DayJsAdapterModule } from "adapters/implementations/dayjs/dayjs.module";

import { AccountService } from "./account.service";

@Module({
	controllers: [AccountController],
	imports: [AccountRepositoryModule, DayJsAdapterModule],
	providers: [AccountService],
	exports: [AccountService],
})
export class AccountModule {}

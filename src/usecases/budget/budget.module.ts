import { Module } from "@nestjs/common";

import { BudgetRepositoryModule } from "repositories/postgres/budget/budget-repository.module";
import { BudgetController } from "delivery/budget.controller";
import { TransactionRepositoryModule } from "repositories/postgres/transaction/transaction-repository.module";
import { CategoryRepositoryModule } from "repositories/postgres/category/category-repository.module";
import { DayJsAdapterModule } from "adapters/implementations/dayjs/dayjs.module";

import { AccountModule } from "../account/account.module";

import { BudgetService } from "./budget.service";

@Module({
	controllers: [BudgetController],
	imports: [
		BudgetRepositoryModule,
		CategoryRepositoryModule,
		TransactionRepositoryModule,
		AccountModule,
		DayJsAdapterModule,
	],
	providers: [BudgetService],
	exports: [BudgetService],
})
export class BudgetModule {}

import { Module } from "@nestjs/common";
import { BudgetController } from "src/delivery/budget.controller";
import { BudgetRepositoryModule } from "src/repositories/postgres/budget/budget-repository.module";

import { AccountModule } from "../account/account.module";

import { BudgetService } from "./budget.service";

@Module({
	controllers: [BudgetController],
	imports: [BudgetRepositoryModule, AccountModule],
	providers: [BudgetService],
	exports: [BudgetService],
})
export class BudgetModule {}

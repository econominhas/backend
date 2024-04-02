import { Module } from "@nestjs/common";

import { UIDAdapterModule } from "adapters/implementations/uid/uid.module";
import { DayJsAdapterModule } from "adapters/implementations/dayjs/dayjs.module";

import { PostgresModule } from "..";

import { BudgetRepositoryService } from "./budget-repository.service";

@Module({
	imports: [
		PostgresModule.forFeature(["budget", "budgetDate"]),
		DayJsAdapterModule,
		UIDAdapterModule,
	],
	providers: [BudgetRepositoryService],
	exports: [BudgetRepositoryService],
})
export class BudgetRepositoryModule {}

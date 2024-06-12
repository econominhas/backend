import { Module } from "@nestjs/common";

import { DayJsAdapterModule } from "adapters/implementations/dayjs/dayjs.module";
import { ULIDAdapterModule } from "adapters/implementations/ulid/ulid.module";

import { PostgresModule } from "..";

import { BudgetRepositoryService } from "./budget-repository.service";

@Module({
	imports: [
		PostgresModule.forFeature(["budget", "budgetDate"]),
		DayJsAdapterModule,
		ULIDAdapterModule,
	],
	providers: [BudgetRepositoryService],
	exports: [BudgetRepositoryService],
})
export class BudgetRepositoryModule {}

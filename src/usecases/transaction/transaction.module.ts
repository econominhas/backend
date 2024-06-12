import { Module } from "@nestjs/common";

import { TransactionRepositoryModule } from "repositories/postgres/transaction/transaction-repository.module";
import { TransactionController } from "delivery/transaction.controller";
import { UtilsAdapterModule } from "adapters/implementations/utils/utils.module";
import { BankModule } from "usecases/bank/bank.module";
import { BankRepositoryModule } from "repositories/postgres/bank/bank-repository.module";
import { BudgetRepositoryModule } from "repositories/postgres/budget/budget-repository.module";
import { CategoryRepositoryModule } from "repositories/postgres/category/category-repository.module";
import { CardRepositoryModule } from "repositories/postgres/card/card-repository.module";
import { BudgetModule } from "usecases/budget/budget.module";
import { CardModule } from "usecases/card/card.module";
import { ULIDAdapterModule } from "adapters/implementations/ulid/ulid.module";

import { TransactionService } from "./transaction.service";

@Module({
	controllers: [TransactionController],
	imports: [
		TransactionRepositoryModule,
		BankRepositoryModule,
		BudgetRepositoryModule,
		CategoryRepositoryModule,
		CardRepositoryModule,

		BankModule,
		BudgetModule,
		CardModule,

		ULIDAdapterModule,
		UtilsAdapterModule,
	],
	providers: [TransactionService],
	exports: [TransactionService],
})
export class TransactionModule {}

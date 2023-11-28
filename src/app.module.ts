import { Module } from "@nestjs/common";

import { PostgresModule } from "./repositories/postgres";
import { AccountModule } from "./usecases/account/account.module";
import { AuthModule } from "./usecases/auth/auth.module";
import { BankModule } from "./usecases/bank/bank.module";
import { BudgetModule } from "./usecases/budget/budget.module";
import { CardModule } from "./usecases/card/card.module";
import { CategoryModule } from "./usecases/category/category.module";
import { TermsAndPoliciesModule } from "./usecases/terms-and-policies/terms-and-policies.module";

@Module({
	imports: [
		PostgresModule.forRoot(),
		AuthModule,
		AccountModule,
		TermsAndPoliciesModule,
		CategoryModule,
		BankModule,
		CardModule,
		BudgetModule,
	],
})
export class AppModule {}

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";

import { HealthCheckModule } from "health-check/health-check.module";

import { AccountModule } from "./usecases/account/account.module";
import { PostgresModule } from "./repositories/postgres";
import { TermsAndPoliciesModule } from "./usecases/terms-and-policies/terms-and-policies.module";
import { CategoryModule } from "./usecases/category/category.module";
import { BankModule } from "./usecases/bank/bank.module";
import { CardModule } from "./usecases/card/card.module";
import { BudgetModule } from "./usecases/budget/budget.module";
import { AuthModule } from "./usecases/auth/auth.module";
import { RecurrentTransactionModule } from "./usecases/recurrent-transaction/recurrent-transaction.module";
import { WalletModule } from "./usecases/wallet/wallet.module";
import { TransactionModule } from "./usecases/transaction/transaction.module";
import { validateConfig } from "./config";

@Module({
	imports: [
		ConfigModule.forRoot({
			validate: validateConfig,
			isGlobal: true,
		}),
		ScheduleModule.forRoot(),
		PostgresModule.forRoot(),
		AuthModule,
		AccountModule,
		TermsAndPoliciesModule,
		CategoryModule,
		BankModule,
		CardModule,
		BudgetModule,
		RecurrentTransactionModule,
		TransactionModule,
		WalletModule,
		HealthCheckModule,
	],
})
export class AppModule {}

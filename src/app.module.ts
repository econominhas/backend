import { Module } from '@nestjs/common';
import { AccountModule } from './usecases/account/account.module';
import { PostgresModule } from './repositories/postgres';
import { TermsAndPoliciesModule } from './usecases/terms-and-policies/terms-and-policies.module';
import { CategoryModule } from './usecases/category/category.module';
import { BankModule } from './usecases/bank/bank.module';
import { CardModule } from './usecases/card/card.module';

@Module({
	imports: [
		PostgresModule.forRoot(),
		AccountModule,
		TermsAndPoliciesModule,
		CategoryModule,
		BankModule,
		CardModule,
	],
})
export class AppModule {}

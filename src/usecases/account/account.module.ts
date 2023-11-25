import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountRepositoryModule } from 'src/repositories/postgres/account/account-repository.module';
import { TokenAdapter } from 'src/adapters/implementations/token.service';
import { AuthController } from 'src/delivery/auth.controller';
import { GoogleAdapter } from 'src/adapters/implementations/google.service';
import { SESAdapter } from 'src/adapters/implementations/ses.service';
import { TermsAndPoliciesModule } from '../terms-and-policies/terms-and-policies.module';
import { MagicLinkCodeRepositoryModule } from 'src/repositories/postgres/magic-link-code/magic-link-code-repository.module';
import { RefreshTokenRepositoryModule } from 'src/repositories/postgres/refresh-token/refresh-token-repository.module';

@Module({
	controllers: [AuthController],
	imports: [
		AccountRepositoryModule,
		MagicLinkCodeRepositoryModule,
		RefreshTokenRepositoryModule,

		TermsAndPoliciesModule,
	],
	providers: [AccountService, GoogleAdapter, TokenAdapter, SESAdapter],
})
export class AccountModule {}

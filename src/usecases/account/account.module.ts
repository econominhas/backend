import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountRepositoryModule } from 'src/repositories/postgres/account/account-repository.module';
import { TokenAdapter } from 'src/adapters/implementations/token.service';
import { AuthController } from 'src/delivery/auth.controller';
import { GoogleAdapter } from 'src/adapters/implementations/google.service';
import { SESAdapter } from 'src/adapters/implementations/ses.service';
import { TermsAndPoliciesModule } from '../terms-and-policies/terms-and-policies.module';

@Module({
	controllers: [AuthController],
	imports: [AccountRepositoryModule, TermsAndPoliciesModule],
	providers: [AccountService, GoogleAdapter, TokenAdapter, SESAdapter],
})
export class AccountModule {}

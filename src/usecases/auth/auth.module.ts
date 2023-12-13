import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from 'delivery/auth.controller';
import { TermsAndPoliciesModule } from '../terms-and-policies/terms-and-policies.module';
import { MagicLinkCodeRepositoryModule } from 'repositories/postgres/magic-link-code/magic-link-code-repository.module';
import { RefreshTokenRepositoryModule } from 'repositories/postgres/refresh-token/refresh-token-repository.module';
import { AuthRepositoryModule } from 'repositories/postgres/auth/auth-repository.module';
import { GoogleAdapterModule } from 'adapters/implementations/google/google.module';
import { JWTAdapterModule } from 'adapters/implementations/jwt/token.module';
import { SESAdapterModule } from 'adapters/implementations/ses/ses.module';
import { SNSAdapterModule } from 'adapters/implementations/sns/sns.module';

@Module({
	controllers: [AuthController],
	imports: [
		AuthRepositoryModule,
		MagicLinkCodeRepositoryModule,
		RefreshTokenRepositoryModule,

		GoogleAdapterModule,
		JWTAdapterModule,
		SESAdapterModule,
		SNSAdapterModule,

		TermsAndPoliciesModule,
	],
	providers: [AuthService],
})
export class AuthModule {}

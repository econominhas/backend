import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from 'src/delivery/auth.controller';
import { TermsAndPoliciesModule } from '../terms-and-policies/terms-and-policies.module';
import { MagicLinkCodeRepositoryModule } from 'src/repositories/postgres/magic-link-code/magic-link-code-repository.module';
import { RefreshTokenRepositoryModule } from 'src/repositories/postgres/refresh-token/refresh-token-repository.module';
import { AuthRepositoryModule } from 'src/repositories/postgres/auth/auth-repository.module';
import { GoogleAdapterModule } from 'src/adapters/implementations/google/google.module';
import { JWTAdapterModule } from 'src/adapters/implementations/jwt/token.module';
import { SESAdapterModule } from 'src/adapters/implementations/ses/ses.module';
import { SNSAdapterModule } from 'src/adapters/implementations/sns/sns.module';

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

import { Module } from "@nestjs/common";

import { AuthController } from "delivery/auth.controller";
import { MagicLinkCodeRepositoryModule } from "repositories/postgres/magic-link-code/magic-link-code-repository.module";
import { RefreshTokenRepositoryModule } from "repositories/postgres/refresh-token/refresh-token-repository.module";
import { AuthRepositoryModule } from "repositories/postgres/auth/auth-repository.module";
import { GoogleAdapterModule } from "adapters/implementations/google/google.module";
import { PasetoAdapterModule } from "adapters/implementations/paseto/paseto.module";
import { SESAdapterModule } from "adapters/implementations/ses/ses.module";
import { SNSSMSAdapterModule } from "adapters/implementations/sns-sms/sns.module";
import { SNSAdapterModule } from "adapters/implementations/sns/sns.module";

import { TermsAndPoliciesModule } from "../terms-and-policies/terms-and-policies.module";

import { AuthService } from "./auth.service";

@Module({
	controllers: [AuthController],
	imports: [
		AuthRepositoryModule,
		MagicLinkCodeRepositoryModule,
		RefreshTokenRepositoryModule,

		GoogleAdapterModule,
		PasetoAdapterModule,
		SESAdapterModule,
		SNSSMSAdapterModule,
		SNSAdapterModule,

		TermsAndPoliciesModule,
	],
	providers: [AuthService],
})
export class AuthModule {}

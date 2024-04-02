import { Module } from "@nestjs/common";

import { TermsAndPoliciesRepositoryModule } from "repositories/postgres/terms-and-policies/terms-and-policies-repository.module";
import { TermsAndPoliciesController } from "delivery/terms-and-policies.controller";

import { TermsAndPoliciesService } from "./terms-and-policies.service";

@Module({
	controllers: [TermsAndPoliciesController],
	imports: [TermsAndPoliciesRepositoryModule],
	providers: [TermsAndPoliciesService],
	exports: [TermsAndPoliciesService],
})
export class TermsAndPoliciesModule {}

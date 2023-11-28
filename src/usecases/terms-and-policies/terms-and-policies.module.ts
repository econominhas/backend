import { Module } from "@nestjs/common";
import { TermsAndPoliciesController } from "src/delivery/terms-and-policies.controller";
import { TermsAndPoliciesRepositoryModule } from "src/repositories/postgres/terms-and-policies/terms-and-policies-repository.module";

import { TermsAndPoliciesService } from "./terms-and-policies.service";

@Module({
	controllers: [TermsAndPoliciesController],
	imports: [TermsAndPoliciesRepositoryModule],
	providers: [TermsAndPoliciesService],
	exports: [TermsAndPoliciesService],
})
export class TermsAndPoliciesModule {}

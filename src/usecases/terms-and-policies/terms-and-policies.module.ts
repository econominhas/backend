import { Module } from '@nestjs/common';
import { TermsAndPoliciesService } from './terms-and-policies.service';
import { TermsAndPoliciesRepositoryModule } from 'repositories/postgres/terms-and-policies/terms-and-policies-repository.module';
import { TermsAndPoliciesController } from 'delivery/terms-and-policies.controller';

@Module({
	controllers: [TermsAndPoliciesController],
	imports: [TermsAndPoliciesRepositoryModule],
	providers: [TermsAndPoliciesService],
	exports: [TermsAndPoliciesService],
})
export class TermsAndPoliciesModule {}

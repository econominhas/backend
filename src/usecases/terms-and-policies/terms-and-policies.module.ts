import { Module } from '@nestjs/common';
import { TermsAndPoliciesService } from './terms-and-policies.service';
import { TermsAndPoliciesRepositoryModule } from 'src/repositories/postgres/terms-and-policies/terms-and-policies-repository.module';
import { TermsAndPoliciesController } from 'src/delivery/terms-and-policies.controller';

@Module({
	controllers: [TermsAndPoliciesController],
	imports: [TermsAndPoliciesRepositoryModule],
	providers: [TermsAndPoliciesService],
})
export class TermsAndPoliciesModule {}

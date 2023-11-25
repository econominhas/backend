import { Module } from '@nestjs/common';
import { PostgresModule } from '..';
import { TermsAndPoliciesRepositoryService } from './terms-and-policies-repository.service';

@Module({
	imports: [
		PostgresModule.forFeature(['termsAndPolicies', 'termsAndPoliciesAccepted']),
	],
	providers: [TermsAndPoliciesRepositoryService],
	exports: [TermsAndPoliciesRepositoryService],
})
export class TermsAndPoliciesRepositoryModule {}

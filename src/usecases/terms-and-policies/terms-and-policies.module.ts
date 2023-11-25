import { Module } from '@nestjs/common';
import { TermsAndPoliciesService } from './terms-and-policies.service';
import { AuthController } from 'src/delivery/auth.controller';
import { TermsAndPoliciesRepositoryModule } from 'src/repositories/postgres/terms-and-policies/terms-and-policies-repository.module';

@Module({
	controllers: [AuthController],
	imports: [TermsAndPoliciesRepositoryModule],
	providers: [TermsAndPoliciesService],
})
export class TermsAndPoliciesModule {}

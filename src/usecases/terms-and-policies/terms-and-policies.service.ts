import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import type { TermsAndPolicies } from "@prisma/client";
import {
	TermsAndPoliciesRepository,
	TermsAndPoliciesUseCase,
	type AcceptInput,
	type HasAcceptedLatestInput,
} from "src/models/terms-and-policies";
import { TermsAndPoliciesRepositoryService } from "src/repositories/postgres/terms-and-policies/terms-and-policies-repository.service";

@Injectable()
export class TermsAndPoliciesService extends TermsAndPoliciesUseCase {
	constructor(
		@Inject(TermsAndPoliciesRepositoryService)
		private readonly termsAndPoliciesRepository: TermsAndPoliciesRepository,
	) {
		super();
	}

	getLatest(): Promise<TermsAndPolicies> {
		return this.termsAndPoliciesRepository.getLatest();
	}

	async accept({ accountId, semVer }: AcceptInput): Promise<void> {
		const [latestTerms, latestTermsAccepted] = await Promise.all([
			this.termsAndPoliciesRepository.getLatest(),
			this.termsAndPoliciesRepository.getLatestAccepted({ accountId }),
		]);

		if (latestTerms.semVer !== semVer) {
			throw new BadRequestException(
				`Invalid semVer, user must accepted version "${semVer}"`,
			);
		}

		if (latestTermsAccepted.semVer === semVer) {
			throw new BadRequestException("User already accepted terms");
		}

		await this.termsAndPoliciesRepository.accept({
			accountId,
			semVer,
		});
	}

	async hasAcceptedLatest({
		accountId,
	}: HasAcceptedLatestInput): Promise<boolean> {
		const [latestTermsAccepted, latestTerms] = await Promise.all([
			this.termsAndPoliciesRepository.getLatestAccepted({ accountId }),
			this.termsAndPoliciesRepository.getLatest(),
		]);

		return latestTermsAccepted.semVer === latestTerms.semVer;
	}
}

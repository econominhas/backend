import type {
	TermsAndPolicies,
	TermsAndPoliciesAccepted,
} from '@prisma/client';

/**
 *
 *
 * Repository
 *
 *
 */

export interface AcceptInput {
	accountId: string;
	semVer: string;
}

export interface GetLatestAcceptedInput {
	accountId: string;
}

export abstract class TermsAndPoliciesRepository {
	abstract accept(i: AcceptInput): Promise<void>;

	abstract getLatest(): Promise<TermsAndPolicies>;

	abstract getLatestAccepted(
		i: GetLatestAcceptedInput,
	): Promise<TermsAndPoliciesAccepted | undefined>;
}

/**
 *
 *
 * Usecase
 *
 *
 */

export interface HasAcceptedLatestInput {
	accountId: string;
}

export abstract class TermsAndPoliciesUseCase {
	abstract accept(i: AcceptInput): Promise<void>;

	abstract hasAcceptedLatest(i: HasAcceptedLatestInput): Promise<boolean>;

	abstract getLatest(): Promise<TermsAndPolicies>;
}

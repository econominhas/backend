import { Injectable } from '@nestjs/common';
import { InjectRepository, Repository } from '..';
import {
	AcceptInput,
	GetLatestAcceptedInput,
	TermsAndPoliciesRepository,
} from 'src/models/terms-and-policies';
import { TermsAndPolicies, TermsAndPoliciesAccepted } from '@prisma/client';

@Injectable()
export class TermsAndPoliciesRepositoryService extends TermsAndPoliciesRepository {
	constructor(
		@InjectRepository('termsAndPolicies')
		private readonly termsAndPoliciesRepository: Repository<'termsAndPolicies'>,
		@InjectRepository('termsAndPoliciesAccepted')
		private readonly termsAndPoliciesAcceptedRepository: Repository<'termsAndPoliciesAccepted'>,
	) {
		super();
	}

	async accept({ accountId, semVer }: AcceptInput): Promise<void> {
		try {
			await this.termsAndPoliciesAcceptedRepository.create({
				data: {
					accountId,
					semVer,
				},
			});
		} catch (err) {
			// https://www.prisma.io/docs/reference/api-reference/error-reference#p2003
			if (err.code === 'P2003') {
				throw new Error("Version doesn't exists");
			}
			if (err.code === 'P2004') {
				throw new Error('Version already accepted');
			}

			throw new Error(`Fail to accept version: ${err.message}`);
		}
	}

	getLatest(): Promise<TermsAndPolicies | undefined> {
		return this.termsAndPoliciesRepository.findFirst({
			orderBy: {
				liveAt: 'desc',
			},
		});
	}

	getLatestAccepted({
		accountId,
	}: GetLatestAcceptedInput): Promise<TermsAndPoliciesAccepted | undefined> {
		return this.termsAndPoliciesAcceptedRepository.findFirst({
			where: {
				accountId,
			},
			orderBy: {
				acceptedAt: 'desc',
			},
		});
	}
}

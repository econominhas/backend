import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from "@nestjs/common";
import {
	type TermsAndPolicies,
	type TermsAndPoliciesAccepted,
} from "@prisma/client";

import {
	TermsAndPoliciesRepository,
	type AcceptInput,
	type GetLatestAcceptedInput,
} from "models/terms-and-policies";

import { InjectRepository, Repository } from "..";

@Injectable()
export class TermsAndPoliciesRepositoryService extends TermsAndPoliciesRepository {
	constructor(
		@InjectRepository("termsAndPolicies")
		private readonly termsAndPoliciesRepository: Repository<"termsAndPolicies">,
		@InjectRepository("termsAndPoliciesAccepted")
		private readonly termsAndPoliciesAcceptedRepository: Repository<"termsAndPoliciesAccepted">,
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
			if (err.code === "P2003") {
				throw new NotFoundException("Version doesn't exists");
			}
			// https://www.prisma.io/docs/reference/api-reference/error-reference#p2004
			if (err.code === "P2004") {
				throw new ConflictException("Version already accepted");
			}

			throw new InternalServerErrorException(
				`Fail to accept version: ${err.message}`,
			);
		}
	}

	getLatest(): Promise<TermsAndPolicies | undefined> {
		return this.termsAndPoliciesRepository.findFirst({
			where: {
				liveAt: {
					lte: new Date(),
				},
			},
			orderBy: {
				liveAt: "desc",
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
				acceptedAt: "desc",
			},
		});
	}
}

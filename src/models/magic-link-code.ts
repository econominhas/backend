import type { MagicLinkCode, TimezoneEnum } from '@prisma/client';

/**
 *
 *
 * Repository
 *
 *
 */

export interface UpsertInput {
	accountId: string;
	isFirstAccess: boolean;
}

export interface GetInput {
	accountId: string;
	code: string;
}

export interface GetOutput extends MagicLinkCode {
	account: {
		config: {
			timezone: TimezoneEnum;
		};
	};
}

export abstract class MagicLinkCodeRepository {
	abstract upsert(i: UpsertInput): Promise<MagicLinkCode>;

	abstract get(i: GetInput): Promise<GetOutput | undefined>;
}

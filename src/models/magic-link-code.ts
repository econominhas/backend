import { MagicLinkCode } from '@prisma/client';

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

export type GetOutput = MagicLinkCode;

export abstract class MagicLinkCodeRepository {
	abstract upsert(i: UpsertInput): Promise<MagicLinkCode>;

	abstract get(i: GetInput): Promise<GetOutput | undefined>;
}

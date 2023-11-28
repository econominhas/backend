import type { RefreshToken, TimezoneEnum } from '@prisma/client';

/**
 *
 *
 * Repository
 *
 *
 */

export interface CreateInput {
	accountId: string;
}

export interface GetByTokenInput {
	refreshToken: string;
}

export interface GetByTokenOutput extends RefreshToken {
	account: {
		config: {
			timezone: TimezoneEnum;
		};
	};
}

export abstract class RefreshTokenRepository {
	abstract create(i: CreateInput): Promise<RefreshToken>;

	abstract get(i: GetByTokenInput): Promise<GetByTokenOutput | undefined>;
}

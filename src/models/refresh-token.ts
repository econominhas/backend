import { RefreshToken } from '@prisma/client';

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

export abstract class RefreshTokenRepository {
	abstract create(i: CreateInput): Promise<RefreshToken>;

	abstract get(i: GetByTokenInput): Promise<RefreshToken | undefined>;
}

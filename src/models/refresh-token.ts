import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class RefreshTokenEntity {
	@PrimaryKey({ type: 'char(16)' })
	accountId!: string;

	@Property({ type: 'char(64)' })
	refreshToken!: string;

	@Property({ type: 'timestamp' })
	createdAt = new Date();
}

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
	abstract create(i: CreateInput): Promise<RefreshTokenEntity>;

	abstract get(i: GetByTokenInput): Promise<RefreshTokenEntity | undefined>;
}

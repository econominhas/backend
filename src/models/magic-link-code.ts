import { Entity, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { AccountEntity } from './account';

@Entity()
export class MagicLinkCodeEntity {
	@PrimaryKey({ type: 'char(16)' })
	accountId!: string;

	@Property({ type: 'char(32)' })
	code!: string;

	@Property()
	isFirstAccess!: boolean;

	@Property({ type: 'timestamp' })
	createdAt = new Date();

	@OneToOne()
	account!: AccountEntity;
}

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

export abstract class MagicLinkCodeRepository {
	abstract upsert(i: UpsertInput): Promise<MagicLinkCodeEntity>;

	abstract get(i: GetInput): Promise<MagicLinkCodeEntity | undefined>;
}

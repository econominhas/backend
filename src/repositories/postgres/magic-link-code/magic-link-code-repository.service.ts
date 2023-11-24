import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import {
	UpsertInput,
	GetInput,
	MagicLinkCodeEntity,
	MagicLinkCodeRepository,
} from 'src/models/magic-link-code';
import { UIDSecretAdapter } from 'src/adapters/implementations/uid-secret.service';

@Injectable()
export class MagicLinkCodeRepositoryService extends MagicLinkCodeRepository {
	constructor(
		@InjectRepository(MagicLinkCodeEntity)
		private readonly magicLinkCodeRepository: EntityRepository<MagicLinkCodeEntity>,
		private readonly secretAdapter: UIDSecretAdapter,
	) {
		super();
	}

	upsert({
		accountId,
		isFirstAccess,
	}: UpsertInput): Promise<MagicLinkCodeEntity> {
		return this.magicLinkCodeRepository.upsert({
			accountId,
			isFirstAccess: isFirstAccess ?? false,
			code: this.secretAdapter.gen(),
		});
	}

	get({ accountId, code }: GetInput): Promise<MagicLinkCodeEntity> {
		return this.magicLinkCodeRepository.findOne({
			accountId,
			code,
		});
	}
}

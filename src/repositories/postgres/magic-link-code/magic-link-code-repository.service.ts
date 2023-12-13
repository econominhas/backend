import { Inject, Injectable } from '@nestjs/common';
import type { UpsertInput, GetInput, GetOutput } from 'models/magic-link-code';
import { MagicLinkCodeRepository } from 'models/magic-link-code';
import { InjectRepository, Repository } from '..';
import type { MagicLinkCode } from '@prisma/client';
import { SecretAdapter } from 'adapters/secret';
import { UIDAdapterService } from 'adapters/implementations/uid/uid.service';

@Injectable()
export class MagicLinkCodeRepositoryService extends MagicLinkCodeRepository {
	constructor(
		@InjectRepository('magicLinkCode')
		private readonly magicLinkCodeRepository: Repository<'magicLinkCode'>,

		@Inject(UIDAdapterService)
		private readonly secretAdapter: SecretAdapter,
	) {
		super();
	}

	upsert({ accountId, isFirstAccess }: UpsertInput): Promise<MagicLinkCode> {
		return this.magicLinkCodeRepository.upsert({
			where: {
				accountId,
			},
			create: {
				accountId,
				isFirstAccess: isFirstAccess ?? false,
				code: this.secretAdapter.genSecret(),
				createdAt: new Date(),
			},
			update: {
				accountId,
				isFirstAccess: isFirstAccess ?? false,
				code: this.secretAdapter.genSecret(),
				createdAt: new Date(),
			},
		});
	}

	get({ accountId, code }: GetInput): Promise<GetOutput> {
		return this.magicLinkCodeRepository.findUnique({
			where: {
				accountId,
				code,
			},
		});
	}
}

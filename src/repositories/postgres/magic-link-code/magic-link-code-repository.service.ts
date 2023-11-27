import { Inject, Injectable } from '@nestjs/common';
import type {
	UpsertInput,
	GetInput,
	GetOutput,
} from 'src/models/magic-link-code';
import { MagicLinkCodeRepository } from 'src/models/magic-link-code';
import { UIDSecretAdapter } from 'src/adapters/implementations/uid-secret.service';
import { InjectRepository, Repository } from '..';
import type { MagicLinkCode } from '@prisma/client';
import { SecretAdapter } from 'src/adapters/secret';

@Injectable()
export class MagicLinkCodeRepositoryService extends MagicLinkCodeRepository {
	constructor(
		@InjectRepository('magicLinkCode')
		private readonly magicLinkCodeRepository: Repository<'magicLinkCode'>,

		@Inject(UIDSecretAdapter)
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
				code: this.secretAdapter.gen(),
				createdAt: new Date(),
			},
			update: {
				accountId,
				isFirstAccess: isFirstAccess ?? false,
				code: this.secretAdapter.gen(),
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

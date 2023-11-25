import { Injectable } from '@nestjs/common';
import {
	UpsertInput,
	GetInput,
	MagicLinkCodeRepository,
	GetOutput,
} from 'src/models/magic-link-code';
import { UIDSecretAdapter } from 'src/adapters/implementations/uid-secret.service';
import { InjectRepository, Repository } from '..';
import { MagicLinkCode } from '@prisma/client';

@Injectable()
export class MagicLinkCodeRepositoryService extends MagicLinkCodeRepository {
	constructor(
		@InjectRepository('magicLinkCode')
		private readonly magicLinkCodeRepository: Repository<'magicLinkCode'>,
		private readonly secretAdapter: UIDSecretAdapter,
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

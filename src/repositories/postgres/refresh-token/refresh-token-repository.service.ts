import { Inject, Injectable } from '@nestjs/common';
import type {
	CreateInput,
	GetByTokenInput,
	GetByTokenOutput,
} from 'models/refresh-token';
import { RefreshTokenRepository } from 'models/refresh-token';
import { InjectRepository, Repository } from '..';
import type { RefreshToken } from '@prisma/client';
import { TokenAdapter } from 'adapters/token';
import { PasetoAdapterService } from 'adapters/implementations/paseto/token.service';

@Injectable()
export class RefreshTokenRepositoryService extends RefreshTokenRepository {
	constructor(
		@InjectRepository('refreshToken')
		private readonly refreshTokenRepository: Repository<'refreshToken'>,

		@Inject(PasetoAdapterService)
		private readonly tokenAdapter: TokenAdapter,
	) {
		super();
	}

	async create({ accountId }: CreateInput): Promise<RefreshToken> {
		const { refreshToken } = this.tokenAdapter.genRefresh();

		return this.refreshTokenRepository.create({
			data: {
				accountId,
				refreshToken,
			},
		});
	}

	get({
		refreshToken,
	}: GetByTokenInput): Promise<GetByTokenOutput | undefined> {
		return this.refreshTokenRepository.findUnique({
			where: {
				refreshToken,
			},
		});
	}
}

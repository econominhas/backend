import { Inject, Injectable } from '@nestjs/common';
import type { CreateInput, GetByTokenInput } from 'src/models/refresh-token';
import { RefreshTokenRepository } from 'src/models/refresh-token';
import { JwtUidTokenAdapter } from 'src/adapters/implementations/token.service';
import { InjectRepository, Repository } from '..';
import type { RefreshToken } from '@prisma/client';
import { AuthTokensAdapter } from 'src/adapters/token';

@Injectable()
export class RefreshTokenRepositoryService extends RefreshTokenRepository {
	constructor(
		@InjectRepository('refreshToken')
		private readonly refreshTokenRepository: Repository<'refreshToken'>,

		@Inject(JwtUidTokenAdapter)
		private readonly tokenAdapter: AuthTokensAdapter,
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

	get({ refreshToken }: GetByTokenInput): Promise<RefreshToken> {
		return this.refreshTokenRepository.findUnique({
			where: {
				refreshToken,
			},
		});
	}
}

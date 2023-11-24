import { Injectable } from '@nestjs/common';
import {
	CreateInput,
	GetByTokenInput,
	RefreshTokenRepository,
} from 'src/models/refresh-token';
import { TokenAdapter } from 'src/adapters/implementations/token.service';
import { InjectRepository, Repository } from '..';
import { RefreshToken } from '@prisma/client';

@Injectable()
export class RefreshTokenRepositoryService extends RefreshTokenRepository {
	constructor(
		@InjectRepository('refreshToken')
		private readonly refreshTokenRepository: Repository<'refreshToken'>,
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

	get({ refreshToken }: GetByTokenInput): Promise<RefreshToken> {
		return this.refreshTokenRepository.findFirst({
			where: {
				refreshToken,
			},
		});
	}
}

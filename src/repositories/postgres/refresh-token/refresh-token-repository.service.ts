import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import {
	CreateInput,
	GetByTokenInput,
	RefreshTokenEntity,
	RefreshTokenRepository,
} from 'src/models/refresh-token';
import { TokenAdapter } from 'src/adapters/implementations/token.service';

@Injectable()
export class RefreshTokenRepositoryService extends RefreshTokenRepository {
	constructor(
		@InjectRepository(RefreshTokenEntity)
		private readonly refreshTokenRepository: EntityRepository<RefreshTokenEntity>,
		private readonly tokenAdapter: TokenAdapter,
	) {
		super();
	}

	async create({ accountId }: CreateInput): Promise<RefreshTokenEntity> {
		const { refreshToken } = this.tokenAdapter.genRefresh();

		return this.refreshTokenRepository.create({
			accountId,
			refreshToken,
		});
	}

	get({ refreshToken }: GetByTokenInput): Promise<RefreshTokenEntity> {
		return this.refreshTokenRepository.findOne({
			refreshToken,
		});
	}
}

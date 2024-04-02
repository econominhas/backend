import { Inject, Injectable } from "@nestjs/common";
import { type RefreshToken } from "@prisma/client";

import {
	RefreshTokenRepository,
	type CreateInput,
	type GetByTokenInput,
	type GetByTokenOutput,
} from "models/refresh-token";
import { TokenAdapter } from "adapters/token";
import { PasetoAdapterService } from "adapters/implementations/paseto/paseto.service";

import { InjectRepository, Repository } from "..";

@Injectable()
export class RefreshTokenRepositoryService extends RefreshTokenRepository {
	constructor(
		@InjectRepository("refreshToken")
		private readonly refreshTokenRepository: Repository<"refreshToken">,

		@Inject(PasetoAdapterService)
		private readonly tokenAdapter: TokenAdapter,
	) {
		super();
	}

	create({ accountId }: CreateInput): Promise<RefreshToken> {
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

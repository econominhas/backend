import { Inject, Injectable } from '@nestjs/common';
import type {
	GenAccessInput,
	GenAccessOutput,
	GenRefreshOutput,
	TokenPayload,
	ValidateAccessInput,
} from '../../token';
import { TokensAdapter } from '../../token';
import { sign, verify } from 'jsonwebtoken';
import { SecretAdapter } from 'adapters/secret';
import { UIDAdapterService } from '../uid/uid.service';
import { AppConfig } from 'config';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JWTAdapterService extends TokensAdapter {
	constructor(
		@Inject(UIDAdapterService)
		protected readonly secretAdapter: SecretAdapter,

		@Inject(ConfigService)
		protected readonly config: AppConfig,
	) {
		super();
	}

	genAccess({
		accountId,
		hasAcceptedLatestTerms,
	}: GenAccessInput): GenAccessOutput {
		const payload: TokenPayload = {
			sub: accountId,
			terms: hasAcceptedLatestTerms,
		};

		const expiresAt = '';

		const accessToken = sign(payload, this.config.get('JWT_SECRET'));

		return {
			accessToken,
			expiresAt,
		};
	}

	validateAccess({ accessToken }: ValidateAccessInput): TokenPayload {
		try {
			const payload = verify(
				accessToken,
				this.config.get('JWT_SECRET'),
			) as TokenPayload;

			return payload;
		} catch {
			return;
		}
	}

	genRefresh(): GenRefreshOutput {
		return {
			refreshToken: this.secretAdapter.genSuperSecret(),
		};
	}
}

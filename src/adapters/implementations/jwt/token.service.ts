import { Inject, Injectable } from '@nestjs/common';
import type {
	GenAccessInput,
	GenAccessOutput,
	GenRefreshOutput,
	TokenPayload,
	ValidateAccessInput,
} from '../../token';
import { TokenAdapter } from '../../token';
import type * as Jwt from 'jsonwebtoken';
import { SecretAdapter } from 'adapters/secret';
import { UIDAdapterService } from '../uid/uid.service';
import { AppConfig } from 'config';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JWTAdapterService extends TokenAdapter {
	constructor(
		@Inject('jsonwebtoken')
		protected readonly jwt: typeof Jwt,

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

		const accessToken = this.jwt.sign(payload, this.config.get('JWT_SECRET'));

		return {
			accessToken,
			expiresAt,
		};
	}

	validateAccess({ accessToken }: ValidateAccessInput): TokenPayload {
		try {
			const payload = this.jwt.verify(
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

import { Inject, Injectable } from '@nestjs/common';
import type {
	GenAccessInput,
	GenAccessOutput,
	GenRefreshOutput,
	TokenPayload,
} from '../../token';
import { TokensAdapter } from '../../token';
import { sign } from 'jsonwebtoken';
import { SecretAdapter } from 'src/adapters/secret';
import { UIDAdapterService } from '../uid/uid.service';

@Injectable()
export class JWTAdapterService extends TokensAdapter {
	constructor(
		@Inject(UIDAdapterService)
		protected readonly secretAdapter: SecretAdapter,
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

		const accessToken = sign(payload, process.env['JWT_SECRET']);

		return {
			accessToken,
			expiresAt,
		};
	}

	genRefresh(): GenRefreshOutput {
		return {
			refreshToken: this.secretAdapter.genSuperSecret(),
		};
	}
}

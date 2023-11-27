import { Injectable } from '@nestjs/common';
import type {
	GenAccessInput,
	GenAccessOutput,
	GenRefreshOutput,
	TokenPayload,
} from '../token';
import { AuthTokensAdapter } from '../token';
import { sign } from 'jsonwebtoken';
import { uid } from 'uid/single';

@Injectable()
export class JwtUidTokenAdapter extends AuthTokensAdapter {
	genAccess({
		accountId,
		hasAcceptedLatestTerms,
	}: GenAccessInput): GenAccessOutput {
		const payload: TokenPayload = {
			sub: accountId,
			terms: hasAcceptedLatestTerms,
		};

		const accessToken = sign(payload, process.env['JWT_SECRET']);

		return {
			accessToken,
			expiresAt: '',
		};
	}

	genRefresh(): GenRefreshOutput {
		return {
			refreshToken: uid(64),
		};
	}
}

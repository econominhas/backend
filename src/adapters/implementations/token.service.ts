import { Injectable } from '@nestjs/common';
import {
	GenAccessInput,
	GenAccessOutput,
	GenRefreshOutput,
	TokenAdapter as TokenAdapterType,
	TokenPayload,
} from '../token';
import { sign } from 'jsonwebtoken';
import { uid } from 'uid/single';

@Injectable()
export class TokenAdapter extends TokenAdapterType {
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

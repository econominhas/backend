import { Injectable } from '@nestjs/common';
import {
	GenAccessInput,
	GenAccessOutput,
	GenRefreshOutput,
	TokenAdapter as TokenAdapterType,
} from '../token';
import { sign } from 'jsonwebtoken';
import { uid } from 'uid/single';

@Injectable()
export class TokenAdapter extends TokenAdapterType {
	genAccess({ id }: GenAccessInput): GenAccessOutput {
		const accessToken = sign(
			{
				sub: id,
			},
			process.env['JWT_SECRET'],
		);

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

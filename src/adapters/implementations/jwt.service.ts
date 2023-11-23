import { Injectable } from '@nestjs/common';
import { GenInput, GenOutput, TokenAdapter } from '../token';
import { sign } from 'jsonwebtoken';

@Injectable()
export class JWTAdapter implements TokenAdapter {
	gen({ id }: GenInput): GenOutput {
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
}

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { decode } from 'jsonwebtoken';
import { TokenPayload, UserData as UserDataType } from 'src/adapters/token';

export const UserData = createParamDecorator(
	(data: undefined, ctx: ExecutionContext): UserDataType => {
		const request = ctx.switchToHttp().getRequest<Request>();

		const [token] = request.headers.authorization?.split(' ') ?? [];

		const payload = decode(token) as TokenPayload;

		return {
			accountId: payload?.sub,
			hasAcceptedLatestTerms: payload.terms,
		};
	},
);

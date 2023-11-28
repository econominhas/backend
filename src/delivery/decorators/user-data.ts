import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import type { Request } from 'express';
import { decode } from 'jsonwebtoken';
import type {
	TokenPayload,
	UserData as UserDataType,
} from 'src/adapters/token';

export const UserData = createParamDecorator(
	(data: undefined, ctx: ExecutionContext): UserDataType => {
		const request = ctx.switchToHttp().getRequest<Request>();

		const [token] = request.headers.authorization?.split(' ') ?? [];

		const payload = decode(token) as TokenPayload | undefined;

		if (!payload) {
			return {} as UserDataType;
		}

		return {
			accountId: payload.sub,
			hasAcceptedLatestTerms: payload.terms,
			timezone: payload.tz,
		};
	},
);

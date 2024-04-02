import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import { type Request } from "express";
import { decode } from "paseto";

import {
	type TokenPayload,
	type UserData as UserDataType,
} from "adapters/token";

export const validate = (
	_data: undefined,
	ctx: ExecutionContext,
): UserDataType => {
	try {
		const request = ctx.switchToHttp().getRequest<Request>();

		const [, token] = request.headers.authorization?.split(" ") ?? [];

		const payload = decode<TokenPayload>(token)?.payload;

		if (!payload) {
			return {} as UserDataType;
		}

		return {
			accountId: payload.sub,
			hasAcceptedLatestTerms: payload.terms,
		};
	} catch (err) {
		return {} as any;
	}
};

export const UserData = createParamDecorator(validate);

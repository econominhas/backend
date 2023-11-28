import { Injectable } from "@nestjs/common";
import { sign } from "jsonwebtoken";
import { uid } from "uid/single";

import {
	AuthTokensAdapter,
	type GenAccessInput,
	type GenAccessOutput,
	type GenRefreshOutput,
	type TokenPayload,
} from "../token";

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

		const accessToken = sign(payload, process.env.JWT_SECRET);

		return {
			accessToken,
			expiresAt: "",
		};
	}

	genRefresh(): GenRefreshOutput {
		return {
			refreshToken: uid(64),
		};
	}
}

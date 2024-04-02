import { type KeyObject } from "crypto";

import { Inject, Injectable } from "@nestjs/common";
import { type V4 } from "paseto";
import { ConfigService } from "@nestjs/config";

import { SecretAdapter } from "adapters/secret";
import { AppConfig } from "config";
import { DateAdapter } from "adapters/date";

import { UIDAdapterService } from "../uid/uid.service";
import {
	TokenAdapter,
	type GenAccessInput,
	type GenAccessOutput,
	type GenRefreshOutput,
	type TokenPayload,
	type ValidateAccessInput,
} from "../../token";
import { DayjsAdapterService } from "../dayjs/dayjs.service";

@Injectable()
export class PasetoAdapterService extends TokenAdapter {
	constructor(
		@Inject("paseto")
		protected readonly paseto: typeof V4,

		@Inject(UIDAdapterService)
		protected readonly secretAdapter: SecretAdapter,
		@Inject(DayjsAdapterService)
		protected readonly dateAdapter: DateAdapter,

		@Inject(ConfigService)
		protected readonly config: AppConfig,
	) {
		super();
	}

	private getSecret(): KeyObject {
		const secretString = this.config.get("PASETO_PRIVATE_KEY");
		const secretBuffer = Buffer.from(secretString, "base64");
		return this.paseto.bytesToKeyObject(secretBuffer);
	}

	async genAccess({
		accountId,
		hasAcceptedLatestTerms,
	}: GenAccessInput): Promise<GenAccessOutput> {
		const payload: TokenPayload = {
			sub: accountId,
			terms: hasAcceptedLatestTerms,
			exp: this.dateAdapter.nowPlus(this.expiration, "minute").toISOString(),
		};

		const secret = this.getSecret();

		const accessToken = await this.paseto.sign(payload as any, secret);

		return {
			accessToken,
			expiresAt: payload.exp,
		};
	}

	validateAccess({ accessToken }: ValidateAccessInput): Promise<TokenPayload> {
		const secret = this.getSecret();

		return this.paseto.verify<TokenPayload>(accessToken, secret);
	}

	genRefresh(): GenRefreshOutput {
		return {
			refreshToken: this.secretAdapter.genSuperSecret(),
		};
	}
}

import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Axios } from "axios";

import { DateAdapter } from "adapters/date";
import { AppConfig } from "config";

import {
	AuthProviderAdapter,
	type ExchangeCodeInput,
	type ExchangeCodeOutput,
	type GetAuthenticatedUserDataOutput,
} from "../../auth-provider";
import { DayjsAdapterService } from "../dayjs/dayjs.service";

interface ExchangeCodeAPIOutput {
	access_token: string;
	token_type: string;
	expires_in: number;
	refresh_token: string;
	scope: string;
}

interface GetUserDataAPIOutput {
	sub: string; // ID
	given_name: string; // First name
	email: string;
	email_verified: boolean;
}

@Injectable()
export class GoogleAdapterService extends AuthProviderAdapter {
	readonly requiredScopes = [
		"https://www.googleapis.com/auth/userinfo.profile",
		"openid",
		"https://www.googleapis.com/auth/userinfo.email",
	];

	constructor(
		@Inject("axios")
		protected readonly axios: Axios,

		@Inject(DayjsAdapterService)
		protected readonly dateAdapter: DateAdapter,

		@Inject(ConfigService)
		protected readonly config: AppConfig,
	) {
		super();
	}

	async exchangeCode({
		code,
		originUrl,
	}: ExchangeCodeInput): Promise<ExchangeCodeOutput> {
		// ALERT: The order of the properties is important, don't change it!
		const body = new URLSearchParams();
		body.append("code", code);
		body.append("client_id", this.config.get("GOOGLE_CLIENT_ID"));
		body.append("client_secret", this.config.get("GOOGLE_CLIENT_SECRET"));
		if (originUrl) {
			body.append("redirect_uri", originUrl);
		}
		body.append("grant_type", "authorization_code");
		// ALERT: The order of the properties is important, don't change it!

		const result = await this.axios
			.post("https://oauth2.googleapis.com/token", body, {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					"Accept": "application/json",
				},
			})
			.then(r => r.data as ExchangeCodeAPIOutput)
			.catch(err => {
				throw new Error(JSON.stringify(err?.response?.data || {}));
			});

		return {
			accessToken: result.access_token,
			refreshToken: result.refresh_token,
			scopes: result.scope.split(" "),
			expiresAt: this.dateAdapter.nowPlus(result.expires_in - 60, "second"),
		};
	}

	async getAuthenticatedUserData(
		accessToken: string,
	): Promise<GetAuthenticatedUserDataOutput> {
		const result = await this.axios
			.get("https://openidconnect.googleapis.com/v1/userinfo", {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})
			.then(r => r.data as GetUserDataAPIOutput)
			.catch(err => {
				throw new Error(JSON.stringify(err?.response?.data || {}));
			});

		return {
			id: result.sub,
			name: result.given_name,
			email: result.email,
			isEmailVerified: result.email_verified,
		};
	}
}

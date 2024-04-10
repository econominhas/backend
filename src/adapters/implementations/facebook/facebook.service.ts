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
}

interface GetAppTokenAPIOutput {
	access_token: string;
}

interface TokenDebugAPIOutput {
	data: {
		app_id: number;
		type: "USER";
		application: string;
		expires_at: number;
		is_valid: boolean;
		issued_at: number;
		metadata: {
			sso: string;
		};
		scopes: Array<"email" | "publish_actions">;
		user_id: string;
	};
}

interface GetUserDataAPIOutput {
	id: string;
	name: string;
	email?: string;
}

@Injectable()
export class FacebookAdapterService extends AuthProviderAdapter {
	readonly requiredScopes = ["public_profile", "email"];

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
		body.append("client_id", this.config.get("FACEBOOK_CLIENT_ID"));
		body.append("client_secret", this.config.get("FACEBOOK_CLIENT_SECRET"));
		if (originUrl) {
			body.append("redirect_uri", originUrl);
		}
		body.append("grant_type", "authorization_code");
		// ALERT: The order of the properties is important, don't change it!

		const result = await this.axios
			.post("https://graph.facebook.com/v19.0/oauth/access_token", body, {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					"Accept": "application/json",
				},
			})
			.then(r => r.data as ExchangeCodeAPIOutput)
			.catch(err => {
				throw new Error(JSON.stringify(err?.response?.data || {}));
			});

		const tokenDebug = await this.getTokenData(result.access_token);

		return {
			accessToken: result.access_token,
			scopes: tokenDebug.scopes,
			expiresAt: this.dateAdapter.nowPlus(result.expires_in - 60, "second"),
		};
	}

	async getAuthenticatedUserData(
		accessToken: string,
	): Promise<GetAuthenticatedUserDataOutput> {
		const result = await this.axios
			.get(
				`https://graph.facebook.com/v19.0/me/?fields=id,name,email&access_token=${accessToken}`,
			)
			.then(r => r.data as GetUserDataAPIOutput)
			.catch(err => {
				throw new Error(JSON.stringify(err?.response?.data || {}));
			});

		return {
			id: result.id,
			name: result.name,
			email: result.email || "foo@bar.com",
			isEmailVerified: Boolean(result.email),
		};
	}

	// Private

	private async getTokenData(accessToken: string) {
		const appToken = await this.axios
			.get("https://graph.facebook.com/oauth/access_token", {
				params: {
					client_id: this.config.get("FACEBOOK_CLIENT_ID"),
					client_secret: this.config.get("FACEBOOK_CLIENT_SECRET"),
					grant_type: "client_credentials",
				},
			})
			.then(r => r.data as GetAppTokenAPIOutput)
			.catch(err => {
				throw new Error(JSON.stringify(err?.response?.data || {}));
			});

		const tokenDebug = await this.axios
			.get("https://graph.facebook.com/debug_token", {
				params: {
					input_token: accessToken,
					access_token: appToken.access_token,
				},
				headers: {
					Accept: "application/json",
				},
			})
			.then(r => (r.data as TokenDebugAPIOutput).data)
			.catch(err => {
				throw new Error(JSON.stringify(err?.response?.data || {}));
			});

		return {
			...tokenDebug,
			appToken: appToken.access_token,
		};
	}
}

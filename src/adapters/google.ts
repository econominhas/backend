export interface ExchangeCodeInput {
	code: string;
	originUrl: string;
}

export interface ExchangeCodeOutput {
	scopes: Array<string>;
	accessToken: string;
	refreshToken: string;
	expiresAt: Date;
}

export interface GetAuthenticatedUserDataOutput {
	id: string;
	name: string;
	email: string;
	isEmailVerified: boolean;
}

export abstract class GoogleAdapter {
	readonly requiredScopes = ["openid", "profile", "email"];

	abstract exchangeCode(i: ExchangeCodeInput): Promise<ExchangeCodeOutput>;

	abstract getAuthenticatedUserData(
		accessToken: string,
	): Promise<GetAuthenticatedUserDataOutput>;
}

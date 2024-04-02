export interface TokenPayload {
	sub: string; // Account ID
	terms: boolean; // Tells if the user accepted the latest terms and policies
	exp: string; // Expiration ISO date
}

export interface UserData {
	accountId: string;
	hasAcceptedLatestTerms: boolean;
}

export type GenAccessInput = UserData;

export interface GenAccessOutput {
	accessToken: string;
	expiresAt: string; // ISO date
}

export interface ValidateAccessInput {
	accessToken: string;
}

export interface GenRefreshOutput {
	refreshToken: string;
}

export abstract class TokenAdapter {
	protected expiration = 15; // Amount of time that the access token should be valid, in minutes

	abstract genAccess(i: GenAccessInput): Promise<GenAccessOutput>;

	/**
	 * Throw error if fail to validate
	 */
	abstract validateAccess(i: ValidateAccessInput): Promise<TokenPayload>;

	abstract genRefresh(): GenRefreshOutput;
}

export interface TokenPayload {
	sub: string; // Account ID
	terms: boolean; // Tells if the user accepted the latest terms and policies
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
	abstract genAccess(i: GenAccessInput): GenAccessOutput;

	abstract validateAccess(i: ValidateAccessInput): TokenPayload | undefined;

	abstract genRefresh(): GenRefreshOutput;
}

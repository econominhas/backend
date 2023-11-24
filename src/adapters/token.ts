export interface TokenPayload {
	sub: string; // Account ID
}

export interface UserData {
	accountId: string;
}

export interface GenAccessInput {
	id: string;
}

export interface GenAccessOutput {
	accessToken: string;
	expiresAt: string; // ISO date
}

export interface GenRefreshOutput {
	refreshToken: string;
}

export abstract class TokenAdapter {
	abstract genAccess(i: GenAccessInput): GenAccessOutput;

	abstract genRefresh(): GenRefreshOutput;
}

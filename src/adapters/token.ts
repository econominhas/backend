export interface TokenPayload {
	sub: string; // Account ID
}

export interface UserData {
	accountId: string;
}

export interface GenInput {
	id: string;
}

export interface GenOutput {
	accessToken: string;
	expiresAt: string; // ISO date
}

export interface TokenAdapter {
	gen: (i: GenInput) => GenOutput;
}

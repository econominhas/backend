export interface LatestInput {
	versions: Array<string>;
}

export interface IsLatestInput {
	toValidate: string | undefined;
	compareWith: string | undefined;
}

export interface VersionAdapter {
	latest: (i: LatestInput) => string;

	isGt: (i: IsLatestInput) => boolean;
}

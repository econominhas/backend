import { Injectable } from '@nestjs/common';
import { IsLatestInput, LatestInput, VersionAdapter } from '../version';

import { gt, rsort } from 'semver';

@Injectable()
export class SemVerAdapter implements VersionAdapter {
	latest({ versions }: LatestInput): string {
		const [latestSemVer] = rsort(versions);

		return latestSemVer;
	}

	isGt({ toValidate, compareWith }: IsLatestInput): boolean {
		if (!compareWith) return true;
		if (!toValidate) return false;

		return gt(toValidate, compareWith);
	}
}

import { uid } from 'uid/secure';
import { Injectable } from '@nestjs/common';
import type { IdAdapter } from '../../id';
import type { SecretAdapter } from '../../secret';

@Injectable()
export class UIDAdapterService implements IdAdapter, SecretAdapter {
	genId(): string {
		return uid(16);
	}

	genSecret(): string {
		return uid(32);
	}

	genSuperSecret(): string {
		return uid(64);
	}
}

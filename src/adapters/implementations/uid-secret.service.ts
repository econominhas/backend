import { uid } from 'uid/single';
import { Injectable } from '@nestjs/common';
import type { SecretAdapter } from '../secret';

@Injectable()
export class UIDSecretAdapter implements SecretAdapter {
	gen(): string {
		return uid(32);
	}
}

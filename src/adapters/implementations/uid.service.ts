import { uid } from 'uid/secure';
import { Injectable } from '@nestjs/common';
import type { IdAdapter } from '../id';

@Injectable()
export class UIDAdapter implements IdAdapter {
	gen(): string {
		return uid(16);
	}
}

import { Inject, Injectable } from "@nestjs/common";

import { type IdAdapter } from "../../id";
import { type SecretAdapter } from "../../secret";

@Injectable()
export class UIDAdapterService implements IdAdapter, SecretAdapter {
	constructor(
		@Inject("uid/secure")
		protected uid: (length?: number) => string,
	) {}

	genId(): string {
		return this.uid(16);
	}

	genSecret(): string {
		return this.uid(32);
	}

	genSuperSecret(): string {
		return this.uid(64);
	}
}

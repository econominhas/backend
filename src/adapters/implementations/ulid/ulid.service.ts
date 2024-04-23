import { Inject, Injectable } from "@nestjs/common";

import { IdAdapter } from "adapters/id";

@Injectable()
export class UlidAdapterService implements IdAdapter {
	constructor(
		@Inject("ulid")
		protected ulid: () => string,
	) {}

	genId(): string {
		return this.ulid();
	}
}

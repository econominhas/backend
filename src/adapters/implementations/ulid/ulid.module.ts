import { Module } from "@nestjs/common";
import { ulid } from "ulid";

import { UlidAdapterService } from "./ulid.service";

@Module({
	providers: [
		UlidAdapterService,
		{
			provide: "ulid",
			useValue: ulid,
		},
	],
	exports: [UlidAdapterService],
})
export class ULIDAdapterModule {}

import { Module } from "@nestjs/common";
import { uid } from "uid/secure";
import { ulid } from "ulid";

import { UIDAdapterService } from "./uid.service";

@Module({
	providers: [
		UIDAdapterService,
		{
			provide: "uid/secure",
			useValue: uid,
		},
		{
			provide: "ulid",
			useValue: ulid,
		},
	],
	exports: [UIDAdapterService],
})
export class UIDAdapterModule {}

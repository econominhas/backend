import { Module } from "@nestjs/common";
import { uid } from "uid/secure";

import { UIDAdapterService } from "./uid.service";

@Module({
	providers: [
		UIDAdapterService,
		{
			provide: "uid/secure",
			useValue: uid,
		},
	],
	exports: [UIDAdapterService],
})
export class UIDAdapterModule {}

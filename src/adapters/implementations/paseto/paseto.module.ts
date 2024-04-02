import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { V4 } from "paseto";

import { UIDAdapterModule } from "../uid/uid.module";
import { DayJsAdapterModule } from "../dayjs/dayjs.module";

import { PasetoAdapterService } from "./paseto.service";

@Module({
	imports: [UIDAdapterModule, DayJsAdapterModule, ConfigModule],
	providers: [
		PasetoAdapterService,
		{
			provide: "paseto",
			useValue: V4,
		},
	],
	exports: [PasetoAdapterService],
})
export class PasetoAdapterModule {}

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import axios from "axios";

import { DayJsAdapterModule } from "../dayjs/dayjs.module";

import { FacebookAdapterService } from "./facebook.service";

@Module({
	imports: [DayJsAdapterModule, ConfigModule],
	providers: [
		{
			provide: "axios",
			useValue: axios,
		},
		FacebookAdapterService,
	],
	exports: [FacebookAdapterService],
})
export class FacebookAdapterModule {}

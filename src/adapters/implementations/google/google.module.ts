import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import axios from "axios";

import { DayJsAdapterModule } from "../dayjs/dayjs.module";

import { GoogleAdapterService } from "./google.service";

@Module({
	imports: [DayJsAdapterModule, ConfigModule],
	providers: [
		{
			provide: "axios",
			useValue: axios,
		},
		GoogleAdapterService,
	],
	exports: [GoogleAdapterService],
})
export class GoogleAdapterModule {}

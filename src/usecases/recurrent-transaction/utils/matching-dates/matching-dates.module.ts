import { Module } from "@nestjs/common";

import { DayJsAdapterModule } from "adapters/implementations/dayjs/dayjs.module";

import { MatchingDates } from "./matching-dates.service";

@Module({
	imports: [DayJsAdapterModule],
	providers: [MatchingDates],
	exports: [MatchingDates],
})
export class MatchingDatesModule {}

import { Module } from '@nestjs/common';
import { MatchingDates } from './matching-dates.service';
import { DayJsAdapterModule } from 'adapters/implementations/dayjs/dayjs.module';

@Module({
	imports: [DayJsAdapterModule],
	providers: [MatchingDates],
	exports: [MatchingDates],
})
export class MatchingDatesModule {}

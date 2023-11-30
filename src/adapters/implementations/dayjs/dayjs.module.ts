import { Module } from '@nestjs/common';
import { DayjsAdapterService } from './dayjs.service';

@Module({
	providers: [DayjsAdapterService],
	exports: [DayjsAdapterService],
})
export class DayJsAdapterModule {}

import { Module } from '@nestjs/common';
import { GoogleAdapterService } from './google.service';
import { DayJsAdapterModule } from '../dayjs/dayjs.module';

@Module({
	imports: [DayJsAdapterModule],
	providers: [GoogleAdapterService],
	exports: [GoogleAdapterService],
})
export class GoogleAdapterModule {}

import { Module } from '@nestjs/common';
import { GoogleAdapterService } from './google.service';
import { DayJsAdapterModule } from '../dayjs/dayjs.module';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [DayJsAdapterModule, ConfigModule],
	providers: [GoogleAdapterService],
	exports: [GoogleAdapterService],
})
export class GoogleAdapterModule {}

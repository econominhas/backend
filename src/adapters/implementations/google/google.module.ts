import { Module } from '@nestjs/common';
import { GoogleAdapterService } from './google.service';
import { DayJsAdapterModule } from '../dayjs/dayjs.module';
import { ConfigModule } from '@nestjs/config';
import axios from 'axios';

@Module({
	imports: [DayJsAdapterModule, ConfigModule],
	providers: [
		{
			provide: 'axios',
			useValue: axios,
		},
		GoogleAdapterService,
	],
	exports: [GoogleAdapterService],
})
export class GoogleAdapterModule {}

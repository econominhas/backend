import { Module } from '@nestjs/common';
import { PasetoAdapterService } from './paseto.service';
import { UIDAdapterModule } from '../uid/uid.module';
import { ConfigModule } from '@nestjs/config';
import { V4 } from 'paseto';
import { DayJsAdapterModule } from '../dayjs/dayjs.module';

@Module({
	imports: [UIDAdapterModule, DayJsAdapterModule, ConfigModule],
	providers: [
		PasetoAdapterService,
		{
			provide: 'paseto',
			useValue: V4,
		},
	],
	exports: [PasetoAdapterService],
})
export class PasetoAdapterModule {}

import { Module } from '@nestjs/common';
import { UIDAdapterService } from './uid.service';
import { uid } from 'uid/secure';

@Module({
	providers: [
		UIDAdapterService,
		{
			provide: 'uid/secure',
			useValue: uid,
		},
	],
	exports: [UIDAdapterService],
})
export class UIDAdapterModule {}

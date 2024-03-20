import { Module } from '@nestjs/common';
import { PasetoAdapterService } from './token.service';
import { UIDAdapterModule } from '../uid/uid.module';
import { ConfigModule } from '@nestjs/config';
import { V4 } from 'paseto';

@Module({
	imports: [UIDAdapterModule, ConfigModule],
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

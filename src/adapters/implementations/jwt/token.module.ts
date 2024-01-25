import { Module } from '@nestjs/common';
import { JWTAdapterService } from './token.service';
import { UIDAdapterModule } from '../uid/uid.module';
import { ConfigModule } from '@nestjs/config';
import * as Jwt from 'jsonwebtoken';

@Module({
	imports: [UIDAdapterModule, ConfigModule],
	providers: [
		JWTAdapterService,
		{
			provide: 'jsonwebtoken',
			useValue: Jwt,
		},
	],
	exports: [JWTAdapterService],
})
export class JWTAdapterModule {}

import { Module } from '@nestjs/common';
import { JWTAdapterService } from './token.service';
import { UIDAdapterModule } from '../uid/uid.module';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [UIDAdapterModule, ConfigModule],
	providers: [JWTAdapterService],
	exports: [JWTAdapterService],
})
export class JWTAdapterModule {}

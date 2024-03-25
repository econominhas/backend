import { Module } from '@nestjs/common';
import { SNSAdapterService } from './sns.service';
import { ConfigModule } from '@nestjs/config';
import { UIDAdapterModule } from '../uid/uid.module';

@Module({
	imports: [ConfigModule, UIDAdapterModule],
	providers: [SNSAdapterService],
	exports: [SNSAdapterService],
})
export class SNSAdapterModule {}

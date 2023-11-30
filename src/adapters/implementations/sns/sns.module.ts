import { Module } from '@nestjs/common';
import { SNSAdapterService } from './sns.service';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [ConfigModule],
	providers: [SNSAdapterService],
	exports: [SNSAdapterService],
})
export class SNSAdapterModule {}

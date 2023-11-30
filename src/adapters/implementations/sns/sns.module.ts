import { Module } from '@nestjs/common';
import { SNSAdapterService } from './sns.service';

@Module({
	providers: [SNSAdapterService],
	exports: [SNSAdapterService],
})
export class SNSAdapterModule {}

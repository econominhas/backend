import { Module } from '@nestjs/common';
import { SNSSMSAdapterService } from './sns.service';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [ConfigModule],
	providers: [SNSSMSAdapterService],
	exports: [SNSSMSAdapterService],
})
export class SNSSMSAdapterModule {}

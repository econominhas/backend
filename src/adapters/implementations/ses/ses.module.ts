import { Module } from '@nestjs/common';
import { SESAdapterService } from './ses.service';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [ConfigModule],
	providers: [SESAdapterService],
	exports: [SESAdapterService],
})
export class SESAdapterModule {}

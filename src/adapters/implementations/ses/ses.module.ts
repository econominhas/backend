import { Module } from '@nestjs/common';
import { SESAdapterService } from './ses.service';

@Module({
	providers: [SESAdapterService],
	exports: [SESAdapterService],
})
export class SESAdapterModule {}

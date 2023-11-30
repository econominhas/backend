import { Module } from '@nestjs/common';
import { UtilsAdapterService } from './utils.service';

@Module({
	providers: [UtilsAdapterService],
	exports: [UtilsAdapterService],
})
export class UtilsAdapterModule {}

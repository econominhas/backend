import { Module } from '@nestjs/common';
import { UIDAdapterService } from './uid.service';

@Module({
	providers: [UIDAdapterService],
	exports: [UIDAdapterService],
})
export class UIDAdapterModule {}

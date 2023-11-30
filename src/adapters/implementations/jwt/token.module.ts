import { Module } from '@nestjs/common';
import { JWTAdapterService } from './token.service';
import { UIDAdapterModule } from '../uid/uid.module';

@Module({
	imports: [UIDAdapterModule],
	providers: [JWTAdapterService],
	exports: [JWTAdapterService],
})
export class JWTAdapterModule {}

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { SESAdapterService } from "./ses.service";

@Module({
	imports: [ConfigModule],
	providers: [SESAdapterService],
	exports: [SESAdapterService],
})
export class SESAdapterModule {}

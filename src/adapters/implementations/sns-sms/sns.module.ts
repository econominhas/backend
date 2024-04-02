import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { SNSSMSAdapterService } from "./sns.service";

@Module({
	imports: [ConfigModule],
	providers: [SNSSMSAdapterService],
	exports: [SNSSMSAdapterService],
})
export class SNSSMSAdapterModule {}

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { UIDAdapterModule } from "../uid/uid.module";

import { SNSAdapterService } from "./sns.service";

@Module({
	imports: [ConfigModule, UIDAdapterModule],
	providers: [SNSAdapterService],
	exports: [SNSAdapterService],
})
export class SNSAdapterModule {}

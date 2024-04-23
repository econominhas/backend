import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ULIDAdapterModule } from "../ulid/ulid.module";

import { SNSAdapterService } from "./sns.service";

@Module({
	imports: [ConfigModule, ULIDAdapterModule],
	providers: [SNSAdapterService],
	exports: [SNSAdapterService],
})
export class SNSAdapterModule {}

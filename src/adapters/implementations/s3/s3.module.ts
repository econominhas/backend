import { Module } from "@nestjs/common";

import { S3AdapterService } from "./s3.service";

@Module({
	providers: [S3AdapterService],
	exports: [S3AdapterService],
})
export class S3AdapterModule {}

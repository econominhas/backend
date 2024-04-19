import { Module } from "@nestjs/common";

import { HealthCheckController } from "./health-check.controller";

@Module({
	imports: [],
	controllers: [HealthCheckController],
})
export class HealthCheckModule {}

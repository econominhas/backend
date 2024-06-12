import { Module } from "@nestjs/common";

import { HealthCheckController } from "delivery/health-check.controller";

@Module({
	controllers: [HealthCheckController],
})
export class HealthCheckModule {}

import { Module } from "@nestjs/common";

import { UIDAdapterModule } from "adapters/implementations/uid/uid.module";

import { PostgresModule } from "..";

import { AuthRepositoryService } from "./auth-repository.service";

@Module({
	imports: [
		PostgresModule.forFeature(["account", "signInProvider"]),
		UIDAdapterModule,
	],
	providers: [AuthRepositoryService],
	exports: [AuthRepositoryService],
})
export class AuthRepositoryModule {}

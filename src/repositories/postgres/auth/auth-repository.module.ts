import { Module } from "@nestjs/common";

import { ULIDAdapterModule } from "adapters/implementations/ulid/ulid.module";

import { PostgresModule } from "..";

import { AuthRepositoryService } from "./auth-repository.service";

@Module({
	imports: [
		PostgresModule.forFeature(["account", "signInProvider"]),
		ULIDAdapterModule,
	],
	providers: [AuthRepositoryService],
	exports: [AuthRepositoryService],
})
export class AuthRepositoryModule {}

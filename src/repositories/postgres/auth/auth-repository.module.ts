import { Module } from "@nestjs/common";

import { AuthRepositoryService } from "./auth-repository.service";

import { UIDAdapter } from "src/adapters/implementations/uid.service";

import { PostgresModule } from "..";

@Module({
	imports: [PostgresModule.forFeature(["account", "signInProvider"])],
	providers: [AuthRepositoryService, UIDAdapter],
	exports: [AuthRepositoryService],
})
export class AuthRepositoryModule {}

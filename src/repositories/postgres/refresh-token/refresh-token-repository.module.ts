import { Module } from "@nestjs/common";

import { PasetoAdapterModule } from "adapters/implementations/paseto/paseto.module";

import { PostgresModule } from "..";

import { RefreshTokenRepositoryService } from "./refresh-token-repository.service";

@Module({
	imports: [PostgresModule.forFeature(["refreshToken"]), PasetoAdapterModule],
	providers: [RefreshTokenRepositoryService],
	exports: [RefreshTokenRepositoryService],
})
export class RefreshTokenRepositoryModule {}

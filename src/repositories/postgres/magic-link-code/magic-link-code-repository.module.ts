import { Module } from "@nestjs/common";

import { UIDAdapterModule } from "adapters/implementations/uid/uid.module";

import { PostgresModule } from "..";

import { MagicLinkCodeRepositoryService } from "./magic-link-code-repository.service";

@Module({
	imports: [PostgresModule.forFeature(["magicLinkCode"]), UIDAdapterModule],
	providers: [MagicLinkCodeRepositoryService],
	exports: [MagicLinkCodeRepositoryService],
})
export class MagicLinkCodeRepositoryModule {}

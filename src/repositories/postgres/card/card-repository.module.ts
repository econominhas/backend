import { Module } from "@nestjs/common";

import { DayJsAdapterModule } from "adapters/implementations/dayjs/dayjs.module";
import { UlidAdapterService } from "adapters/implementations/ulid/ulid.service";

import { PostgresModule } from "..";

import { CardRepositoryService } from "./card-repository.service";

@Module({
	imports: [
		PostgresModule.forFeature(["cardProvider", "card", "cardBill"]),
		PostgresModule.raw(),
		UlidAdapterService,
		DayJsAdapterModule,
	],
	providers: [CardRepositoryService],
	exports: [CardRepositoryService],
})
export class CardRepositoryModule {}

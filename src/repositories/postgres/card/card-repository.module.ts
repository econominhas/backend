import { Module } from "@nestjs/common";

import { DayJsAdapterModule } from "adapters/implementations/dayjs/dayjs.module";
import { ULIDAdapterModule } from "adapters/implementations/ulid/ulid.module";

import { PostgresModule } from "..";

import { CardRepositoryService } from "./card-repository.service";

@Module({
	imports: [
		PostgresModule.forFeature(["cardProvider", "card", "cardBill"]),
		PostgresModule.raw(),
		ULIDAdapterModule,
		DayJsAdapterModule,
	],
	providers: [CardRepositoryService],
	exports: [CardRepositoryService],
})
export class CardRepositoryModule {}

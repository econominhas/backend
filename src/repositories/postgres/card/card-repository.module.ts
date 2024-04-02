import { Module } from "@nestjs/common";

import { UIDAdapterModule } from "adapters/implementations/uid/uid.module";
import { DayJsAdapterModule } from "adapters/implementations/dayjs/dayjs.module";

import { PostgresModule } from "..";

import { CardRepositoryService } from "./card-repository.service";

@Module({
	imports: [
		PostgresModule.forFeature(["cardProvider", "card", "cardBill"]),
		PostgresModule.raw(),
		UIDAdapterModule,
		DayJsAdapterModule,
	],
	providers: [CardRepositoryService],
	exports: [CardRepositoryService],
})
export class CardRepositoryModule {}

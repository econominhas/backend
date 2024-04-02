import { Module } from "@nestjs/common";

import { CardRepositoryModule } from "repositories/postgres/card/card-repository.module";
import { CardController } from "delivery/card.controller";
import { UtilsAdapterModule } from "adapters/implementations/utils/utils.module";
import { DayJsAdapterModule } from "adapters/implementations/dayjs/dayjs.module";

import { CardService } from "./card.service";

@Module({
	controllers: [CardController],
	imports: [CardRepositoryModule, UtilsAdapterModule, DayJsAdapterModule],
	providers: [CardService],
	exports: [CardService],
})
export class CardModule {}

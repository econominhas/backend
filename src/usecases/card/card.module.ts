import { Module } from "@nestjs/common";
import { UtilsAdapterImplementation } from "src/adapters/implementations/utils.service";
import { CardController } from "src/delivery/card.controller";
import { CardRepositoryModule } from "src/repositories/postgres/card/card-repository.module";

import { CardService } from "./card.service";

@Module({
	controllers: [CardController],
	imports: [CardRepositoryModule],
	providers: [CardService, UtilsAdapterImplementation],
	exports: [CardService],
})
export class CardModule {}

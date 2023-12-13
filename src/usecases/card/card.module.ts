import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardRepositoryModule } from 'repositories/postgres/card/card-repository.module';
import { CardController } from 'delivery/card.controller';
import { UtilsAdapterModule } from 'adapters/implementations/utils/utils.module';

@Module({
	controllers: [CardController],
	imports: [CardRepositoryModule, UtilsAdapterModule],
	providers: [CardService],
	exports: [CardService],
})
export class CardModule {}

import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { UtilsAdapterImplementation } from 'src/adapters/implementations/utils.service';
import { CardRepositoryModule } from 'src/repositories/postgres/card/card-repository.module';
import { CardController } from 'src/delivery/card.controller';

@Module({
	controllers: [CardController],
	imports: [CardRepositoryModule],
	providers: [CardService, UtilsAdapterImplementation],
	exports: [CardService],
})
export class CardModule {}

import { Module } from '@nestjs/common';
import { PostgresModule } from '..';
import { CardRepositoryService } from './card-repository.service';

@Module({
	imports: [PostgresModule.forFeature(['cardProvider'])],
	providers: [CardRepositoryService],
	exports: [CardRepositoryService],
})
export class CardRepositoryModule {}

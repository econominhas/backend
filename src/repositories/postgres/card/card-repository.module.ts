import { Module } from '@nestjs/common';
import { PostgresModule } from '..';
import { CardRepositoryService } from './card-repository.service';
import { UIDAdapter } from 'src/adapters/implementations/uid.service';

@Module({
	imports: [
		PostgresModule.forFeature(['cardProvider', 'card']),
		PostgresModule.raw(),
	],
	providers: [CardRepositoryService, UIDAdapter],
	exports: [CardRepositoryService],
})
export class CardRepositoryModule {}

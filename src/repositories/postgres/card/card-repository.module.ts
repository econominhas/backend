import { Module } from '@nestjs/common';
import { PostgresModule } from '..';
import { CardRepositoryService } from './card-repository.service';
import { UIDAdapterModule } from 'src/adapters/implementations/uid/uid.module';

@Module({
	imports: [
		PostgresModule.forFeature(['cardProvider', 'card']),
		PostgresModule.raw(),
		UIDAdapterModule,
	],
	providers: [CardRepositoryService],
	exports: [CardRepositoryService],
})
export class CardRepositoryModule {}

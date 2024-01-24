import { Module } from '@nestjs/common';
import { PostgresModule } from '..';
import { CardRepositoryService } from './card-repository.service';
import { UIDAdapterModule } from 'adapters/implementations/uid/uid.module';
import { DayJsAdapterModule } from 'adapters/implementations/dayjs/dayjs.module';

@Module({
	imports: [
		PostgresModule.forFeature(['cardProvider', 'card']),
		PostgresModule.raw(),
		UIDAdapterModule,
		DayJsAdapterModule,
	],
	providers: [CardRepositoryService],
	exports: [CardRepositoryService],
})
export class CardRepositoryModule {}

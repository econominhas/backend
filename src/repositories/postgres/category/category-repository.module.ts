import { Module } from '@nestjs/common';
import { PostgresModule } from '..';
import { CategoryRepositoryService } from './category-repository.service';
import { UIDAdapterModule } from 'adapters/implementations/uid/uid.module';

@Module({
	imports: [
		PostgresModule.forFeature(['defaultCategory', 'category']),
		UIDAdapterModule,
	],
	providers: [CategoryRepositoryService],
	exports: [CategoryRepositoryService],
})
export class CategoryRepositoryModule {}

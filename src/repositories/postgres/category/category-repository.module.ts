import { Module } from '@nestjs/common';
import { PostgresModule } from '..';
import { CategoryRepositoryService } from './category-repository.service';

@Module({
	imports: [PostgresModule.forFeature(['defaultCategory'])],
	providers: [CategoryRepositoryService],
	exports: [CategoryRepositoryService],
})
export class CategoryRepositoryModule {}

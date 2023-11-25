import { Module } from '@nestjs/common';
import { PostgresModule } from '..';
import { CategoryRepositoryService } from './category-repository.service';
import { UIDAdapter } from 'src/adapters/implementations/uid.service';

@Module({
	imports: [PostgresModule.forFeature(['defaultCategory', 'category'])],
	providers: [CategoryRepositoryService, UIDAdapter],
	exports: [CategoryRepositoryService],
})
export class CategoryRepositoryModule {}

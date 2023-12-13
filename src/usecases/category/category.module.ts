import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryRepositoryModule } from 'repositories/postgres/category/category-repository.module';
import { CategoryController } from 'delivery/category.controller';
import { UtilsAdapterModule } from 'adapters/implementations/utils/utils.module';

@Module({
	controllers: [CategoryController],
	imports: [CategoryRepositoryModule, UtilsAdapterModule],
	providers: [CategoryService],
	exports: [CategoryService],
})
export class CategoryModule {}

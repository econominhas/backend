import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryRepositoryModule } from 'src/repositories/postgres/category/category-repository.module';
import { CategoryController } from 'src/delivery/category.controller';
import { UtilsAdapterModule } from 'src/adapters/implementations/utils/utils.module';

@Module({
	controllers: [CategoryController],
	imports: [CategoryRepositoryModule, UtilsAdapterModule],
	providers: [CategoryService],
	exports: [CategoryService],
})
export class CategoryModule {}

import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryRepositoryModule } from 'src/repositories/postgres/category/category-repository.module';
import { CategoryController } from 'src/delivery/category.controller';
import { UtilsAdapter } from 'src/adapters/implementations/utils.service';

@Module({
	controllers: [CategoryController],
	imports: [CategoryRepositoryModule],
	providers: [CategoryService, UtilsAdapter],
	exports: [CategoryService],
})
export class CategoryModule {}

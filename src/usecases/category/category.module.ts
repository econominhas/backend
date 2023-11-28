import { Module } from "@nestjs/common";
import { UtilsAdapterImplementation } from "src/adapters/implementations/utils.service";
import { CategoryController } from "src/delivery/category.controller";
import { CategoryRepositoryModule } from "src/repositories/postgres/category/category-repository.module";

import { CategoryService } from "./category.service";

@Module({
	controllers: [CategoryController],
	imports: [CategoryRepositoryModule],
	providers: [CategoryService, UtilsAdapterImplementation],
	exports: [CategoryService],
})
export class CategoryModule {}

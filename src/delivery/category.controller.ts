import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';
import { CategoryService } from 'src/usecases/category/category.service';
import { PaginatedDto } from './dtos';

@Controller('categories')
@UseGuards(AuthGuard)
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Get('/default')
	async getDefault(
		@Query()
		pagination: PaginatedDto,
	) {
		return this.categoryService.getDefault(pagination);
	}
}

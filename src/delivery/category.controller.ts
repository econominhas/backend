import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { CategoryService } from 'usecases/category/category.service';
import { PaginatedDto, UserDataDto } from './dtos';
import { UserData } from './decorators/user-data';
import { CreateManyDto } from './dtos/category';
import { CategoryUseCase } from 'models/category';

@Controller('categories')
export class CategoryController {
	constructor(
		@Inject(CategoryService)
		private readonly categoryService: CategoryUseCase,
	) {}

	@Get('/default')
	async getDefault(
		@Query()
		pagination: PaginatedDto,
	) {
		return this.categoryService.getDefault(pagination);
	}

	@Post('/many')
	createMany(
		@UserData()
		userData: UserDataDto,
		@Body()
		body: CreateManyDto,
	) {
		return this.categoryService.createMany({
			...body,
			accountId: userData.accountId,
		});
	}
}

import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';
import { CategoryService } from 'src/usecases/category/category.service';
import { PaginatedDto, UserDataDto } from './dtos';
import { UserData } from './decorators/user-data';
import { CreateManyDto } from './dtos/category';

@Controller('categories')
@UseGuards(AuthGuard())
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

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

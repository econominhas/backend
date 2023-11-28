import { Body, Controller, Get, Inject, Post, Query } from "@nestjs/common";
import { CategoryUseCase } from "src/models/category";
import { CategoryService } from "src/usecases/category/category.service";

import { UserData } from "./decorators/user-data";
import { PaginatedDto, UserDataDto } from "./dtos";
import { CreateManyDto } from "./dtos/category";

@Controller("categories")
export class CategoryController {
	constructor(
		@Inject(CategoryService)
		private readonly categoryService: CategoryUseCase,
	) {}

	@Get("/default")
	getDefault(
		@Query()
		pagination: PaginatedDto,
	) {
		return this.categoryService.getDefault(pagination);
	}

	@Post("/many")
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

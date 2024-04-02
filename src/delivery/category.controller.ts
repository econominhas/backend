import { Body, Controller, Get, Inject, Post, Query } from "@nestjs/common";

import { CategoryService } from "usecases/category/category.service";
import { CategoryUseCase } from "models/category";

import { PaginatedDto, UserDataDto } from "./dtos";
import { UserData } from "./decorators/user-data";
import { CreateManyDto, GetByUserDto } from "./dtos/category";

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

	@Get("/")
	getByUser(
		@UserData()
		userData: UserDataDto,
		@Query()
		query: GetByUserDto,
	) {
		return this.categoryService.getByUser({
			...query,
			accountId: userData.accountId,
		});
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

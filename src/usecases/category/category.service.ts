import { Inject, Injectable } from "@nestjs/common";
import type { DefaultCategory } from "@prisma/client";
import { UtilsAdapterImplementation } from "src/adapters/implementations/utils.service";
import { UtilsAdapter } from "src/adapters/utils";
import {
	CategoryRepository,
	CategoryUseCase,
	type CreateManyInput,
} from "src/models/category";
import { CategoryRepositoryService } from "src/repositories/postgres/category/category-repository.service";

import type { Paginated, PaginatedItems } from "src/types/paginated-items";

@Injectable()
export class CategoryService extends CategoryUseCase {
	constructor(
		@Inject(CategoryRepositoryService)
		private readonly categoryRepository: CategoryRepository,

		@Inject(UtilsAdapterImplementation)
		private readonly utilsAdapter: UtilsAdapter,
	) {
		super();
	}

	async getDefault(i: Paginated): Promise<PaginatedItems<DefaultCategory>> {
		const { paging, ...pagParams } = this.utilsAdapter.pagination(i);

		const data = await this.categoryRepository.getDefault(pagParams);

		return {
			paging,
			data,
		};
	}

	async createMany(i: CreateManyInput): Promise<void> {
		await this.categoryRepository.createMany(i);
	}
}

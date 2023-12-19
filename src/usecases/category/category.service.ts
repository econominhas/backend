import { Inject, Injectable } from '@nestjs/common';
import type { Category, DefaultCategory } from '@prisma/client';
import { UtilsAdapter } from 'adapters/utils';

import type {
	CreateManyInput,
	GetCategoriesByUserInput,
} from 'models/category';
import { CategoryRepository, CategoryUseCase } from 'models/category';
import { CategoryRepositoryService } from 'repositories/postgres/category/category-repository.service';
import type { Paginated, PaginatedItems } from 'types/paginated-items';
import { UtilsAdapterService } from 'adapters/implementations/utils/utils.service';

@Injectable()
export class CategoryService extends CategoryUseCase {
	constructor(
		@Inject(CategoryRepositoryService)
		private readonly categoryRepository: CategoryRepository,

		@Inject(UtilsAdapterService)
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

	async getByUser({
		accountId,
		onlyActive,
		...pagination
	}: GetCategoriesByUserInput): Promise<PaginatedItems<Category>> {
		const { limit, offset, paging } = this.utilsAdapter.pagination(pagination);

		const data = await this.categoryRepository.getByUser({
			accountId,
			onlyActive,
			limit,
			offset,
		});

		return {
			paging,
			data,
		};
	}
}

import { Inject, Injectable } from "@nestjs/common";
import { type Category, type DefaultCategory } from "@prisma/client";

import {
	CategoryRepository,
	type CreateManyInput,
	type GetByIdInput,
	type GetByUserInput,
} from "models/category";
import { type PaginatedRepository } from "types/paginated-items";
import { IdAdapter } from "adapters/id";
import { UlidAdapterService } from "adapters/implementations/ulid/ulid.service";

import { InjectRepository, Repository } from "..";

@Injectable()
export class CategoryRepositoryService extends CategoryRepository {
	constructor(
		@InjectRepository("defaultCategory")
		private readonly defaultCategoryRepository: Repository<"defaultCategory">,
		@InjectRepository("category")
		private readonly categoryRepository: Repository<"category">,

		@Inject(UlidAdapterService)
		private readonly idAdapter: IdAdapter,
	) {
		super();
	}

	getDefault({
		limit,
		offset,
	}: PaginatedRepository): Promise<Array<DefaultCategory>> {
		return this.defaultCategoryRepository.findMany({
			skip: offset,
			take: limit,
		});
	}

	async createMany({ accountId, categories }: CreateManyInput): Promise<void> {
		const data = categories.map(c => ({
			...c,
			accountId,
			id: this.idAdapter.genId(),
			active: true,
		}));

		await this.categoryRepository.createMany({
			data,
		});
	}

	getByUser({
		accountId,
		onlyActive,
		limit,
		offset,
	}: GetByUserInput): Promise<Array<Category>> {
		return this.categoryRepository.findMany({
			where: {
				accountId,
				...(onlyActive
					? {
							active: true,
						}
					: {}),
			},
			orderBy: {
				name: "asc",
			},
			take: limit,
			skip: offset,
		});
	}

	getById({ categoryId, accountId, active }: GetByIdInput): Promise<Category> {
		return this.categoryRepository.findFirst({
			where: {
				id: categoryId,
				accountId,
				...(typeof active !== "undefined"
					? {
							active,
						}
					: {}),
			},
		});
	}
}

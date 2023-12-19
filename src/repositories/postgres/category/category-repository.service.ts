import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository, Repository } from '..';
import type { Category, DefaultCategory } from '@prisma/client';
import type { CreateManyInput, GetByUserInput } from 'models/category';
import { CategoryRepository } from 'models/category';
import type { PaginatedRepository } from 'types/paginated-items';
import { IdAdapter } from 'adapters/id';
import { UIDAdapterService } from 'adapters/implementations/uid/uid.service';

@Injectable()
export class CategoryRepositoryService extends CategoryRepository {
	constructor(
		@InjectRepository('defaultCategory')
		private readonly defaultCategoryRepository: Repository<'defaultCategory'>,
		@InjectRepository('category')
		private readonly categoryRepository: Repository<'category'>,

		@Inject(UIDAdapterService)
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
		const data = categories.map((c) => ({
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
	}: GetByUserInput): Promise<Category[]> {
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
				name: 'asc',
			},
			take: limit,
			skip: offset,
		});
	}
}

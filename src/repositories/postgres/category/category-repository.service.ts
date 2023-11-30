import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository, Repository } from '..';
import type { Category, DefaultCategory } from '@prisma/client';
import type { CreateManyInput, GetAllByUserInput } from 'src/models/category';
import { CategoryRepository } from 'src/models/category';
import type { PaginatedRepository } from 'src/types/paginated-items';
import { IdAdapter } from 'src/adapters/id';
import { UIDAdapterService } from 'src/adapters/implementations/uid/uid.service';

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

	getAllByUser({ accountId }: GetAllByUserInput): Promise<Category[]> {
		return this.categoryRepository.findMany({
			where: {
				accountId,
			},
			orderBy: {
				name: 'asc',
			},
		});
	}
}

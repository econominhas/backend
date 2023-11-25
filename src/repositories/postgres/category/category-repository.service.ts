import { Injectable } from '@nestjs/common';
import { InjectRepository, Repository } from '..';
import { DefaultCategory } from '@prisma/client';
import { CategoryRepository, CreateManyInput } from 'src/models/category';
import { PaginatedRepository } from 'src/types/paginated-items';
import { UIDAdapter } from 'src/adapters/implementations/uid.service';

@Injectable()
export class CategoryRepositoryService extends CategoryRepository {
	constructor(
		@InjectRepository('defaultCategory')
		private readonly defaultCategoryRepository: Repository<'defaultCategory'>,
		@InjectRepository('category')
		private readonly categoryRepository: Repository<'category'>,

		private readonly idAdapter: UIDAdapter,
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
			id: this.idAdapter.gen(),
			active: true,
		}));

		await this.categoryRepository.createMany({
			data,
		});
	}
}

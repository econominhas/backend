import { Injectable } from '@nestjs/common';
import { InjectRepository, Repository } from '..';
import { DefaultCategory } from '@prisma/client';
import { CategoryRepository } from 'src/models/category';
import { PaginatedRepository } from 'src/types/paginated-items';

@Injectable()
export class CategoryRepositoryService extends CategoryRepository {
	constructor(
		@InjectRepository('defaultCategory')
		private readonly defaultCategoryRepository: Repository<'defaultCategory'>,
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
}

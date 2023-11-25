import { DefaultCategory, IconEnum } from '@prisma/client';
import {
	Paginated,
	PaginatedItems,
	PaginatedRepository,
} from 'src/types/paginated-items';

/**
 *
 *
 * Repository
 *
 *
 */

export interface CreateManyInput {
	accountId: string;
	categories: Array<{
		name: string;
		description: string;
		icon: IconEnum;
		color: string;
	}>;
}

export abstract class CategoryRepository {
	abstract getDefault(i: PaginatedRepository): Promise<Array<DefaultCategory>>;

	abstract createMany(i: CreateManyInput): Promise<void>;
}

/**
 *
 *
 * Usecase
 *
 *
 */

export abstract class CategoryUseCase {
	abstract getDefault(i: Paginated): Promise<PaginatedItems<DefaultCategory>>;

	abstract createMany(i: CreateManyInput): Promise<void>;
}

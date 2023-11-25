import { DefaultCategory } from '@prisma/client';
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

export abstract class CategoryRepository {
	abstract getDefault(i: PaginatedRepository): Promise<Array<DefaultCategory>>;
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
}

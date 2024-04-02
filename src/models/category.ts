import {
	type Category,
	type DefaultCategory,
	type IconEnum,
} from "@prisma/client";

import {
	type Paginated,
	type PaginatedItems,
	type PaginatedRepository,
} from "types/paginated-items";

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

export interface GetByUserInput extends PaginatedRepository {
	accountId: string;
	onlyActive?: boolean;
}

export interface GetByIdInput {
	categoryId: string;
	accountId: string;
	active?: boolean;
}

export abstract class CategoryRepository {
	abstract getDefault(i: PaginatedRepository): Promise<Array<DefaultCategory>>;

	abstract createMany(i: CreateManyInput): Promise<void>;

	abstract getByUser(i: GetByUserInput): Promise<Array<Category>>;

	abstract getById(i: GetByIdInput): Promise<Category | null>;
}

/**
 *
 *
 * Usecase
 *
 *
 */

export interface GetCategoriesByUserInput extends Paginated {
	accountId: string;
	onlyActive?: boolean;
}

export abstract class CategoryUseCase {
	abstract getDefault(i: Paginated): Promise<PaginatedItems<DefaultCategory>>;

	abstract createMany(i: CreateManyInput): Promise<void>;

	abstract getByUser(
		i: GetCategoriesByUserInput,
	): Promise<PaginatedItems<Category>>;
}

import { CardProvider } from '@prisma/client';
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

export abstract class CardRepository {
	abstract getProviders(i: PaginatedRepository): Promise<Array<CardProvider>>;
}

/**
 *
 *
 * Usecase
 *
 *
 */

export abstract class CardUseCase {
	abstract getProviders(i: Paginated): Promise<PaginatedItems<CardProvider>>;
}

/**
 *
 *
 * Repository
 *
 *
 */

import { BankProvider } from '@prisma/client';
import {
	Paginated,
	PaginatedItems,
	PaginatedRepository,
} from 'src/types/paginated-items';

export abstract class BankRepository {
	abstract getProviders(i: PaginatedRepository): Promise<Array<BankProvider>>;
}

/**
 *
 *
 * Usecase
 *
 *
 */

export abstract class BankUseCase {
	abstract getProviders(i: Paginated): Promise<PaginatedItems<BankProvider>>;
}

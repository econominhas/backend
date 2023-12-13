import type { BankAccount, BankProvider } from '@prisma/client';
import type {
	Paginated,
	PaginatedItems,
	PaginatedRepository,
} from 'types/paginated-items';

/**
 *
 *
 * Repository
 *
 *
 */

export interface CreateInput {
	accountId: string;
	bankProviderId: string;
	name: string;
	accountNumber: string;
	branch: string;
	balance: number;
}

export interface GetBalanceByUserInput {
	accountId: string;
}

export abstract class BankRepository {
	abstract getProviders(i: PaginatedRepository): Promise<Array<BankProvider>>;

	abstract create(i: CreateInput): Promise<BankAccount>;

	abstract getBalanceByUser(i: GetBalanceByUserInput): Promise<number>;
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

	abstract create(i: CreateInput): Promise<BankAccount>;
}

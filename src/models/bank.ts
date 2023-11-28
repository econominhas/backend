import type { BankAccount, BankProvider } from "@prisma/client";

import type {
	Paginated,
	PaginatedItems,
	PaginatedRepository,
} from "src/types/paginated-items";

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

export abstract class BankRepository {
	abstract getProviders(i: PaginatedRepository): Promise<Array<BankProvider>>;

	abstract create(i: CreateInput): Promise<BankAccount>;
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

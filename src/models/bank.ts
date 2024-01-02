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

export interface GetByUserInput extends PaginatedRepository {
	accountId: string;
}

export interface GetByIdInput {
	bankAccountId: string;
	accountId: string;
}

export interface GetManyByIdInput {
	bankAccountsIds: Array<string>;
	accountId: string;
}

export interface UpdateBalanceInput {
	bankAccountId: string;
	accountId: string;
	amount: number;
}

export abstract class BankRepository {
	abstract getProviders(i: PaginatedRepository): Promise<Array<BankProvider>>;

	abstract create(i: CreateInput): Promise<BankAccount>;

	abstract getBalanceByUser(i: GetBalanceByUserInput): Promise<number>;

	abstract getByUser(i: GetByUserInput): Promise<Array<BankAccount>>;

	abstract getById(i: GetByIdInput): Promise<BankAccount | null>;

	abstract getManyById(i: GetManyByIdInput): Promise<Array<BankAccount>>;

	/**
	 * Increment or decrement the balance based on the amount
	 */
	abstract updateBalance(i: UpdateBalanceInput): Promise<void>;
}

/**
 *
 *
 * Usecase
 *
 *
 */

export interface ListInput extends Paginated {
	accountId: string;
}

export interface TransferInput {
	accountId: string;
	bankAccountFromId: string;
	bankAccountToId: string;
	amount: number;
}

export abstract class BankUseCase {
	abstract getProviders(i: Paginated): Promise<PaginatedItems<BankProvider>>;

	abstract create(i: CreateInput): Promise<BankAccount>;

	abstract list(i: ListInput): Promise<PaginatedItems<BankAccount>>;

	abstract transfer(i: TransferInput): Promise<void>;
}

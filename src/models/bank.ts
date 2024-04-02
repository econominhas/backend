import {
	type BankAccount,
	type BankProvider,
	type TransactionTypeEnum,
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

export interface IncrementBalanceInput {
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
	abstract incrementBalance(i: IncrementBalanceInput): Promise<void>;
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

export interface InOutInput {
	type: typeof TransactionTypeEnum.IN | typeof TransactionTypeEnum.OUT;
	accountId: string;
	bankAccountId: string;
	amount: number;
}

export abstract class BankUseCase {
	abstract getProviders(i: Paginated): Promise<PaginatedItems<BankProvider>>;

	abstract create(i: CreateInput): Promise<BankAccount>;

	abstract list(i: ListInput): Promise<PaginatedItems<BankAccount>>;

	abstract transfer(i: TransferInput): Promise<void>;

	abstract inOut(i: InOutInput): Promise<void>;
}

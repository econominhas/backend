import {
	type RecurrenceCreateEnum,
	type RecurrenceExcludeEnum,
	type RecurrenceFormulaEnum,
	type RecurrenceFrequencyEnum,
	type RecurrenceTryAgainEnum,
	type RecurrentTransaction,
	type TransactionTypeEnum,
} from "@prisma/client";

import { type PaginatedRepository } from "types/paginated-items";

/**
 *
 *
 * Repository
 *
 *
 */

export interface CreateInput {
	accountId: string;
	budgetId: string;
	isSystemManaged: boolean;
	frequency: RecurrenceFrequencyEnum;
	formulaToUse: RecurrenceFormulaEnum;
	startAt: Date;
	endAt: Date;
	baseAmounts: Array<number>;
	cCreates: Array<RecurrenceCreateEnum>;
	cExcludes: Array<RecurrenceExcludeEnum>;
	cTryAgains: Array<RecurrenceTryAgainEnum>;
	// Data to create the transaction
	type: TransactionTypeEnum;
	name: string;
	description: string;
	isSystemManagedT: boolean;
	// Transaction type=IN,OUT,CREDIT
	categoryId?: string;
	// Transaction type=CREDIT
	cardId?: string;
	// Transaction type=IN,OUT
	bankAccountId?: string;
	// Transaction type=TRANSFER
	bankAccountFromId?: string;
	bankAccountToId?: string;
}

export abstract class RecurrentTransactionRepository {
	abstract create(i: CreateInput): Promise<RecurrentTransaction>;

	abstract findMonthly(
		i: PaginatedRepository,
	): Promise<Array<RecurrentTransaction>>;

	abstract findYearly(
		i: PaginatedRepository,
	): Promise<Array<RecurrentTransaction>>;
}

/**
 *
 *
 * Usecase
 *
 *
 */

export abstract class RecurrentTransactionUseCase {
	abstract execMonthly(): Promise<void>;

	abstract execYearly(): Promise<void>;
}

import {
	PaymentMethodEnum,
	RecurrentTransaction,
	RecurrentTransactionFrequencyEnum,
	TransactionTypeEnum,
} from '@prisma/client';

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
	frequency: RecurrentTransactionFrequencyEnum;
	isSystemManaged: boolean;
	// Data to create the transaction
	type: TransactionTypeEnum;
	name: string;
	description: string;
	amount: number;
	budgetItemId: string;
	isSystemManagedT: boolean;
	// Transaction type=IN,OUT
	paymentMethod?: PaymentMethodEnum;
	categoryId?: string;
	cardId?: string;
	bankAccountId?: string;
	// Transaction type=TRANSFER
	bankAccountFromId?: string;
	bankAccountToId?: string;
}

export abstract class RecurrentTransactionRepository {
	abstract create(i: CreateInput): Promise<RecurrentTransaction>;
}

/**
 *
 *
 * Usecase
 *
 *
 */

export interface CreateSalaryInput {
	accountId: string;
	budgetId: string;
	categoryId: string;
	bankAccountId: string;
	amount: number;
	installments: Array<{
		dayOfTheMonth: number;
		percentage: number;
	}>;
}

export abstract class RecurrentTransactionUseCase {
	abstract createSalary(i: CreateSalaryInput): Promise<void>;
}

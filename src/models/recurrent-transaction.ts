import type {
	CaFormulaEnum,
	RecurrenceConditionsEnum,
	RecurrenceFrequencyEnum,
	RecurrentTransaction,
	TransactionTypeEnum,
	Card,
} from '@prisma/client';
import type { PayAtEnum } from 'types/enums/pay-at';

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
	// Data to create the transaction
	type: TransactionTypeEnum;
	name: string;
	description: string;
	amount: number;
	isSystemManagedT: boolean;
	// Transaction type=IN,OUT,CREDIT
	categoryId?: string;
	cardId?: string;
	bankAccountId?: string;
	// Transaction type=TRANSFER
	bankAccountFromId?: string;
	bankAccountToId?: string;

	rules: Array<{
		caFormula: CaFormulaEnum;
		caParams: Record<string, any>;
		caConditions: RecurrenceConditionsEnum[];

		frequency: RecurrenceFrequencyEnum;
		fParams: Record<string, any>;
		fConditions: RecurrenceConditionsEnum[];
	}>;
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
	bankAccountId: string;
	budgetId: string;
	categoryId: string;
	amount: number;
	installments: Array<{
		dayOfTheMonth: number;
		percentage: number;
	}>;
}

export interface CreateCreditCardBillInput {
	accountId: string;
	bankAccountId: string;
	card: Card;
	budgetId: string;
	dueDay: number;
	statementDays: number;
	payAt: PayAtEnum;
}

export abstract class RecurrentTransactionUseCase {
	abstract createSalary(i: CreateSalaryInput): Promise<void>;

	abstract createCreditCardBill(
		i: CreateCreditCardBillInput,
	): Promise<RecurrentTransaction>;
}

import type { Card, CardProvider, CardTypeEnum } from '@prisma/client';
import type { PayAtEnum } from 'types/enums/pay-at';
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

export interface GetProviderInput {
	cardProviderId: string;
}

export interface CreateInput {
	accountId: string;
	cardProviderId: string;
	name: string;
	lastFourDigits: string;
	dueDay?: number;
	limit?: number;
	balance?: number;
}

export interface GetBalanceByUserInput {
	accountId: string;
}

export interface GetBalanceByUserOutput {
	[CardTypeEnum.VA]: number;
	[CardTypeEnum.VR]: number;
	[CardTypeEnum.VT]: number;
}

export interface GetByAccountIdAndTypeInput extends PaginatedRepository {
	accountId: string;
	type: CardTypeEnum;
}

export type GetByAccountIdAndTypeOutput = Array<{
	cardId: string;
	dueDay: number;
	statementDays: number;
}>;

export interface UpdateInput {
	cardId: string;
	// name?: string;
	// dueDay?: number;
	// limit?: number;
	// balance?: number;
	rtBillId?: string;
}

export abstract class CardRepository {
	abstract getProviders(i: PaginatedRepository): Promise<Array<CardProvider>>;

	abstract getProvider(i: GetProviderInput): Promise<CardProvider | undefined>;

	abstract create(i: CreateInput): Promise<Card>;

	abstract getBalanceByUser(
		i: GetBalanceByUserInput,
	): Promise<GetBalanceByUserOutput>;

	abstract getByAccountIdAndType(
		i: GetByAccountIdAndTypeInput,
	): Promise<GetByAccountIdAndTypeOutput>;

	abstract update(i: UpdateInput): Promise<void>;
}

/**
 *
 *
 * Usecase
 *
 *
 */

export type GetProvidersOutput = PaginatedItems<CardProvider>;

export interface CreateCardInput extends CreateInput {
	payAt?: PayAtEnum;
	bankAccountId?: string;
	budgetId?: string;
}

export interface AllCardBillsInput {
	accountId: string;
}

export type AllCardBillsOutput = Array<{
	cardId: string;
	billFromDate: Date;
	billToDate: Date;
	amount: number;
}>;

// ALERT: When updating the card dueDay, we also need to
// update the createdAt of all the transactions created
// with installments, because we create every installment
// based on the first day of the next bills
export abstract class CardUseCase {
	abstract getProviders(i: Paginated): Promise<GetProvidersOutput>;

	abstract create(i: CreateCardInput): Promise<void>;

	abstract allCardsBills(i: AllCardBillsInput): Promise<AllCardBillsOutput>;
}

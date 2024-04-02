import {
	type Card,
	type CardBill,
	type CardNetworkEnum,
	type CardProvider,
	type CardVariantEnum,
	type PayAtEnum,
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
	payAt?: PayAtEnum;
	payWithId?: string;
}

export interface UpdateBalanceInput {
	cardId: string;
	increment: number;
}

export interface GetBalanceByUserInput {
	accountId: string;
}

export interface GetBalanceByUserOutput {
	[CardVariantEnum.VA]: number;
	[CardVariantEnum.VT]: number;
}

export interface GetPostpaidInput extends PaginatedRepository {
	accountId: string;
	date: Date;
}

export interface GetPostpaidOutput {
	id: string;
	name: string;
	lastFourDigits: string;
	provider: {
		iconUrl: string;
		color: string;
		network: CardNetworkEnum;
	};
	bill: {
		total: number;
		startDate: Date;
		endDate: Date;
		statementDate: Date;
		dueDate: Date;
	};
}

export interface GetPrepaidInput extends PaginatedRepository {
	accountId: string;
}

export interface GetPrepaidOutput {
	id: string;
	name: string;
	lastFourDigits: string;
	balance: number;
	provider: {
		iconUrl: string;
		color: string;
		network: CardNetworkEnum;
	};
}

export interface GetBillsToBePaidInput extends PaginatedRepository {
	accountId: string;
	startDate: Date;
	endDate: Date;
}

export interface GetBillsToBePaidOutput {
	id: string;
	name: string;
	lastFourDigits: string;
	provider: {
		iconUrl: string;
		color: string;
		network: CardNetworkEnum;
	};
	bill: {
		total: number;
		payAt: PayAtEnum;
		statementDate: Date;
		dueDate: Date;
	};
}

export interface GetByIdInput {
	cardId: string;
	accountId: string;
}

export interface GetByIdOutput extends Card {
	cardProvider: CardProvider;
}

export interface UpsertManyBillsInput {
	cardId: string;
	month: Date;
	startAt: Date;
	endAt: Date;
	statementDate: Date;
	dueDate: Date;
}

export abstract class CardRepository {
	// Card provider

	abstract getProviders(i: PaginatedRepository): Promise<Array<CardProvider>>;

	abstract getProvider(i: GetProviderInput): Promise<CardProvider | undefined>;

	// Card

	abstract create(i: CreateInput): Promise<Card>;

	abstract updateBalance(i: UpdateBalanceInput): Promise<void>;

	abstract getBalanceByUser(
		i: GetBalanceByUserInput,
	): Promise<GetBalanceByUserOutput>;

	abstract getPostpaid(i: GetPostpaidInput): Promise<Array<GetPostpaidOutput>>;

	abstract getPrepaid(i: GetPrepaidInput): Promise<Array<GetPrepaidOutput>>;

	abstract getById(i: GetByIdInput): Promise<GetByIdOutput | null>;

	// CardBill

	abstract upsertManyBills(
		i: Array<UpsertManyBillsInput>,
	): Promise<Array<CardBill>>;

	abstract getBillsToBePaid(
		i: GetBillsToBePaidInput,
	): Promise<Array<GetBillsToBePaidOutput>>;
}

/**
 *
 *
 * Usecase
 *
 *
 */

export interface GetPostpaidCardsInput extends Paginated {
	accountId: string;
	date: Date;
}

export interface GetPrepaidCardsInput extends Paginated {
	accountId: string;
}

export interface GetCardBillsToBePaidInput extends Paginated {
	accountId: string;
	date: Date;
}

export interface CreateNextCardBillsInput {
	cardId: string;
	accountId: string;
	amount: number;
}

export abstract class CardUseCase {
	abstract getProviders(i: Paginated): Promise<PaginatedItems<CardProvider>>;

	abstract create(i: CreateInput): Promise<void>;

	abstract getPostpaid(
		i: GetPostpaidCardsInput,
	): Promise<PaginatedItems<GetPostpaidOutput>>;

	abstract getPrepaid(
		i: GetPrepaidCardsInput,
	): Promise<PaginatedItems<GetPrepaidOutput>>;

	abstract getBillsToBePaid(
		i: GetCardBillsToBePaidInput,
	): Promise<PaginatedItems<GetBillsToBePaidOutput>>;

	abstract createNextCardBills(
		i: CreateNextCardBillsInput,
	): Promise<Array<CardBill>>;
}

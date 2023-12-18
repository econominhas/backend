import type {
	Card,
	CardNetworkEnum,
	CardProvider,
	CardTypeEnum,
} from '@prisma/client';
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

export interface GetPostpaidInput extends PaginatedRepository {
	accountId: string;
	date: Date;
}

export type GetPostpaidOutput = Array<{
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
		dueDate: Date;
	};
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

	abstract getPostpaid(i: GetPostpaidInput): Promise<GetPostpaidOutput>;

	abstract update(i: UpdateInput): Promise<void>;
}

/**
 *
 *
 * Usecase
 *
 *
 */

export interface CreateCardInput extends CreateInput {
	payAt?: PayAtEnum;
	bankAccountId?: string;
	budgetId?: string;
}

export abstract class CardUseCase {
	abstract getProviders(i: Paginated): Promise<PaginatedItems<CardProvider>>;

	abstract create(i: CreateCardInput): Promise<void>;
}

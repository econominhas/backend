import { Card, CardProvider } from '@prisma/client';
import {
	Paginated,
	PaginatedItems,
	PaginatedRepository,
} from 'src/types/paginated-items';

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

export abstract class CardRepository {
	abstract getProviders(i: PaginatedRepository): Promise<Array<CardProvider>>;

	abstract getProvider(i: GetProviderInput): Promise<CardProvider | undefined>;

	abstract create(i: CreateInput): Promise<Card>;
}

/**
 *
 *
 * Usecase
 *
 *
 */

export abstract class CardUseCase {
	abstract getProviders(i: Paginated): Promise<PaginatedItems<CardProvider>>;

	abstract create(i: CreateInput): Promise<void>;
}

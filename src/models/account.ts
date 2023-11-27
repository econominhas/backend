import { Account, SignInProvider } from '@prisma/client';

/**
 *
 *
 * Repository
 *
 *
 */

export interface GetByIdInput {
	id: string;
}

export interface GetByIdWithProvidersInput {
	id: string;
}

export type GetByIdWithProvidersOutput = Account & {
	signInProviders: Array<SignInProvider>;
};

export interface UpdateConfigInput {
	accountId: string;
	name?: string;
	currentBudgetId?: string;
}

export abstract class AccountRepository {
	abstract getById(i: GetByIdInput): Promise<Account | undefined>;

	abstract getByIdWithProviders(
		i: GetByIdWithProvidersInput,
	): Promise<GetByIdWithProvidersOutput | undefined>;

	abstract updateConfig(i: UpdateConfigInput): Promise<void>;
}

/**
 *
 *
 * Usecase
 *
 *
 */

export interface IamInput {
	accountId: string;
}

export interface IamOutput {
	id: string;
	googleId?: string;
}

export interface UpdateNameInput {
	accountId: string;
	name: string;
}

export interface SetBudgetInput {
	accountId: string;
	budgetId: string;
}

export abstract class AccountUseCase {
	abstract iam(i: IamInput): Promise<IamOutput>;

	abstract updateName(i: UpdateNameInput): Promise<void>;

	abstract setBudget(i: SetBudgetInput): Promise<void>;
}

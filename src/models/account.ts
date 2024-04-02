import {
	type Account,
	type Onboarding,
	type SignInProvider,
} from "@prisma/client";

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

export interface GetOnboardingRecordInput {
	accountId: string;
}

export interface UpdateOnboardingRecordInput {
	accountId: string;
	name?: Date;
	categories?: Date;
	bankAccounts?: Date;
	creditCards?: Date;
	budget?: Date;
	salary?: Date;
}

export abstract class AccountRepository {
	abstract getById(i: GetByIdInput): Promise<Account | undefined>;

	abstract getByIdWithProviders(
		i: GetByIdWithProvidersInput,
	): Promise<GetByIdWithProvidersOutput | undefined>;

	abstract updateConfig(i: UpdateConfigInput): Promise<void>;

	abstract getOnboarding(
		i: GetOnboardingRecordInput,
	): Promise<Onboarding | void>;

	abstract updateOnboarding(i: UpdateOnboardingRecordInput): Promise<void>;
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

export interface GetOnboardingInput {
	accountId: string;
}

export interface GetOnboardingOutput {
	name?: true;
	categories?: true;
	bankAccounts?: true;
	creditCards?: true;
	budget?: true;
	salary?: true;
}

export interface UpdateOnboardingInput {
	accountId: string;
	name?: true;
	categories?: true;
	bankAccounts?: true;
	creditCards?: true;
	budget?: true;
	salary?: true;
}

export abstract class AccountUseCase {
	abstract iam(i: IamInput): Promise<IamOutput>;

	abstract updateName(i: UpdateNameInput): Promise<void>;

	abstract setBudget(i: SetBudgetInput): Promise<void>;

	abstract getOnboarding(i: GetOnboardingInput): Promise<GetOnboardingOutput>;

	abstract updateOnboarding(i: UpdateOnboardingInput): Promise<void>;
}

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

export interface UpdateNameInput {
	accountId: string;
	name: string;
}

export abstract class AccountRepository {
	abstract getById(i: GetByIdInput): Promise<Account | undefined>;

	abstract getByIdWithProviders(
		i: GetByIdWithProvidersInput,
	): Promise<GetByIdWithProvidersOutput | undefined>;

	abstract updateName(i: UpdateNameInput): Promise<void>;
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

export abstract class AccountUseCase {
	abstract updateName(i: UpdateNameInput): Promise<void>;

	abstract iam(i: IamInput): Promise<IamOutput>;
}

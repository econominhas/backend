import type { AccountRepository } from 'models/account';
import type { RepositoryMock } from '../../types';
import { AccountRepositoryService } from 'repositories/postgres/account/account-repository.service';
import type { Account } from '@prisma/client';

export const makeAccountRepositoryMock = () => {
	const baseAccount: Account = {
		id: 'accountId',
		email: 'foo@bar',
		phone: null,
		createdAt: new Date(),
	};

	const accountRepositoryMock: RepositoryMock<AccountRepository> = {
		getById: jest.fn(),
		getByIdWithProviders: jest.fn(),
		updateConfig: jest.fn(),
	};

	const accountRepositoryMockModule = {
		provide: AccountRepositoryService,
		useValue: accountRepositoryMock,
	};

	return {
		baseAccount,
		accountRepositoryMock,
		accountRepositoryMockModule,
	};
};

import type { AccountRepository } from 'models/account';
import type { Mock } from '../../types';
import { AccountRepositoryService } from 'repositories/postgres/account/account-repository.service';
import type { Account } from '@prisma/client';

export const makeAccountRepositoryMock = () => {
	const base: Account = {
		id: 'accountId',
		email: 'foo@bar',
		phone: null,
		createdAt: new Date(),
	};

	const mock: Mock<AccountRepository> = {
		getById: jest.fn(),
		getByIdWithProviders: jest.fn(),
		updateConfig: jest.fn(),
	};

	const module = {
		provide: AccountRepositoryService,
		useValue: mock,
	};

	return {
		base,
		mock,
		module,
	};
};

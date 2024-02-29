import type { AccountUseCase } from 'models/account';
import { AccountService } from 'usecases/account/account.service';
import type { Mock } from '../types';

export const makeAccountServiceMock = () => {
	const mock: Mock<AccountUseCase> = {
		getOnboarding: jest.fn(),
		iam: jest.fn(),
		setBudget: jest.fn(),
		updateName: jest.fn(),
		updateOnboarding: jest.fn(),
	};

	const module = {
		provide: AccountService,
		useValue: mock,
	};

	return {
		mock,
		module,
	};
};

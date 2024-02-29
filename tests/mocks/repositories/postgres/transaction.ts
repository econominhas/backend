import { TransactionRepository } from 'models/transaction';
import type { Mock } from '../../types';
import { TransactionRepositoryService } from 'repositories/postgres/transaction/transaction-repository.service';

export const makeTransactionRepositoryMock = () => {
	const mock: Mock<TransactionRepository> = {
		createCredit: jest.fn(),
		createInOut: jest.fn(),
		createTransfer: jest.fn(),
		getByBudget: jest.fn(),
		getMonthlyAmountByCategory: jest.fn(),
	};

	const outputs = {
		getMonthlyAmountByCategory: [
			{
				categoryId: 'categoryId',
				amount: 100,
			},
		],
	};

	const module = {
		provide: TransactionRepositoryService,
		useValue: mock,
	};

	return {
		outputs,
		mock,
		module,
	};
};

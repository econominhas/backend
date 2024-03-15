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
		getMonthlyAmountByCategory: {
			expensePositive: [
				{ categoryId: 1, amount: 50 },
				{ categoryId: 2, amount: 0 },
				{ categoryId: 3, amount: 100 },
			],
			expenseNegative: [
				{ categoryId: 1, amount: 100 },
				{ categoryId: 2, amount: -50 },
				{ categoryId: 3, amount: 200 },
			],
		},
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

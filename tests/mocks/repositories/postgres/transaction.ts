import { TransactionRepositoryService } from "../../../../src/repositories/postgres/transaction/transaction-repository.service";
import { type Mock } from "../../types";
import { type TransactionRepository } from "../../../../src/models/transaction";

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

import { type BudgetRepository } from "../../../../src/models/budget";
import { BudgetRepositoryService } from "../../../../src/repositories/postgres/budget/budget-repository.service";
import { type Mock } from "../../types";

export const makeBudgetRepositoryMock = () => {
	const mock: Mock<BudgetRepository> = {
		createWithItems: jest.fn(),
		getBudgetDateById: jest.fn(),
		getMonthlyByCategory: jest.fn(),
		upsertManyBudgetDates: jest.fn(),
	};

	const module = {
		provide: BudgetRepositoryService,
		useValue: mock,
	};

	const outputs = {
		createWithItems: {
			sucess: {
				id: "1",
				accountId: "accountId",
				name: "Test Budget",
				description: "Test Budget Description",
			},
		},
		getMonthlyByCategory: {
			positiveBudget: [
				{ categoryId: 1, amount: 100 },
				{ categoryId: 2, amount: 200 },
				{ categoryId: 3, amount: 150 },
			],
			negativeBudget: [
				{ categoryId: 1, amount: -50 },
				{ categoryId: 2, amount: 20 },
				{ categoryId: 3, amount: 150 },
			],
		},
	};
	return {
		mock,
		module,
		outputs,
	};
};

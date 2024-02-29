import { BudgetRepository } from 'models/budget';
import type { Mock } from '../../types';
import { BudgetRepositoryService } from 'repositories/postgres/budget/budget-repository.service';

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
			id: '1',
			accountId: 'accountId',
			name: 'Test Budget',
			description: 'Test Budget Description',
		},
		upsertManyBudgetDates: [
			{
				id: '1',
				budgetId: '1',
				month: 1,
				year: 2024,
				date: new Date(2024, 1, 24, 3, 0, 0),
			},
		],
		getMonthlyByCategory: [
			{
				categoryId: 'categoryId',
				amount: 100,
			},
		],
	};
	return {
		mock,
		module,
		outputs,
	};
};

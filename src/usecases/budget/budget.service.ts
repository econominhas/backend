import { Inject, Injectable } from '@nestjs/common';
import type {
	CreateBasicInput,
	CreateInput,
	OverviewInput,
	OverviewOutput,
} from 'src/models/budget';
import { BudgetRepository, BudgetUseCase } from 'src/models/budget';
import { BudgetRepositoryService } from 'src/repositories/postgres/budget/budget-repository.service';
import { AccountService } from '../account/account.service';
import type { Budget } from '@prisma/client';
import { AccountUseCase } from 'src/models/account';
import { TransactionRepository } from 'src/models/transaction';
import { TransactionRepositoryService } from 'src/repositories/postgres/transaction/transaction-repository.service';
import { CategoryRepository } from 'src/models/category';
import { CategoryRepositoryService } from 'src/repositories/postgres/category/category-repository.service';

@Injectable()
export class BudgetService extends BudgetUseCase {
	constructor(
		@Inject(BudgetRepositoryService)
		private readonly budgetRepository: BudgetRepository,
		@Inject(CategoryRepositoryService)
		private readonly categoryRepository: CategoryRepository,
		@Inject(TransactionRepositoryService)
		private readonly transactionRepository: TransactionRepository,

		@Inject(AccountService)
		private readonly accountService: AccountUseCase,
	) {
		super();
	}

	async create({
		accountId,
		name,
		description,
		year,
		months,
	}: CreateInput): Promise<Budget> {
		const budget = await this.budgetRepository.createWithItems({
			accountId,
			name,
			description,
			months: months.map(({ month, items }) => ({
				month,
				year,
				items,
			})),
		});

		await this.accountService.setBudget({
			accountId,
			budgetId: budget.id,
		});

		return budget;
	}

	async createBasic({
		accountId,
		name,
		description,
		year,
		items,
	}: CreateBasicInput): Promise<Budget> {
		const itemsFormatted = items
			.map(({ categoryId, amount }) =>
				Array(12).map((_, idx) => ({
					month: idx + 1,
					year,
					items: [
						{
							categoryId,
							amount,
						},
					],
				})),
			)
			.flat();

		const budget = await this.budgetRepository.createWithItems({
			accountId,
			name,
			description,
			months: itemsFormatted,
		});

		await this.accountService.setBudget({
			accountId,
			budgetId: budget.id,
		});

		return budget;
	}

	async overview(i: OverviewInput): Promise<OverviewOutput> {
		const [categories, budgets, expenses] = await Promise.all([
			this.categoryRepository.getAllByUser({ accountId: i.accountId }),
			this.budgetRepository.getMonthlyByCategory(i),
			this.transactionRepository.getMonthlyAmountByCategory(i),
		]);

		const totalBudget = budgets.reduce((acc, cur) => acc + cur.amount, 0);
		const totalExpenses = expenses.reduce((acc, cur) => acc + cur.amount, 0);

		const budgetsByCategoryId = Object.fromEntries(
			budgets.map(({ categoryId, amount }) => [categoryId, amount]),
		);
		const expensesByCategoryId = Object.fromEntries(
			expenses.map(({ categoryId, amount }) => [categoryId, amount]),
		);

		return {
			totalBudget,
			totalExpenses,
			remainingBudget: totalBudget - totalExpenses,
			budgetByCategory: categories
				// Only return categories that are active and
				// inactive categories that have some kind of expense
				.filter((c) => !c.active && expensesByCategoryId[c.id] === 0)
				.map(({ accountId: _, ...c }) => ({
					...c,
					totalExpenses: expensesByCategoryId[c.id],
					totalBudget: budgetsByCategoryId[c.id],
					remainingBudget:
						budgetsByCategoryId[c.id] - expensesByCategoryId[c.id],
				})),
		};
	}
}

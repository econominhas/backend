import { Inject, Injectable } from "@nestjs/common";
import { type Budget, type BudgetDate } from "@prisma/client";

import {
	BudgetRepository,
	BudgetUseCase,
	type CreateBasicInput,
	type CreateInput,
	type CreateNextBudgetDatesInput,
	type GetOrCreateManyInput,
	type OverviewInput,
	type OverviewOutput,
} from "models/budget";
import { BudgetRepositoryService } from "repositories/postgres/budget/budget-repository.service";
import { AccountUseCase } from "models/account";
import { TransactionRepository } from "models/transaction";
import { TransactionRepositoryService } from "repositories/postgres/transaction/transaction-repository.service";
import { CategoryRepository } from "models/category";
import { CategoryRepositoryService } from "repositories/postgres/category/category-repository.service";
import { DateAdapter } from "adapters/date";
import { DayjsAdapterService } from "adapters/implementations/dayjs/dayjs.service";

import { AccountService } from "../account/account.service";

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

		@Inject(DayjsAdapterService)
		private readonly dateAdapter: DateAdapter,
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

	getOrCreateMany({
		budgetId,
		dates,
	}: GetOrCreateManyInput): Promise<Array<BudgetDate>> {
		return this.budgetRepository.upsertManyBudgetDates(
			dates.map(date => ({
				budgetId,
				month: this.dateAdapter.get(date, "month"),
				year: this.dateAdapter.get(date, "year"),
				date: this.dateAdapter.startOf(date, "month"),
			})),
		);
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
				Array(12)
					.fill(null)
					.map((_, idx) => ({
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
			this.categoryRepository.getByUser({
				accountId: i.accountId,
				limit: 10000,
				offset: 0,
			}),
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
				/*
				 * Only return categories that are active and
				 * inactive categories that have some kind of expense
				 */
				.filter(c => c.active || expensesByCategoryId[c.id] > 0)
				.map(({ accountId: _, ...c }) => ({
					...c,
					totalExpenses: expensesByCategoryId[c.id],
					totalBudget: budgetsByCategoryId[c.id],
					remainingBudget:
						budgetsByCategoryId[c.id] - expensesByCategoryId[c.id],
				})),
		};
	}

	createNextBudgetDates({
		startFrom,
		amount,
	}: CreateNextBudgetDatesInput): Promise<Array<BudgetDate>> {
		const dates = this.dateAdapter.getNextMonths(startFrom.date, amount);

		return this.budgetRepository.upsertManyBudgetDates(
			dates.map(date => ({
				budgetId: startFrom.budgetId,
				month: this.dateAdapter.get(date, "month"),
				year: this.dateAdapter.get(date, "year"),
				date,
			})),
		);
	}
}

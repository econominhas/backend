import { Inject, Injectable } from '@nestjs/common';
import type { CreateBasicInput, CreateInput } from 'src/models/budget';
import { BudgetRepository, BudgetUseCase } from 'src/models/budget';
import { BudgetRepositoryService } from 'src/repositories/postgres/budget/budget-repository.service';
import { AccountService } from '../account/account.service';
import type { Budget } from '@prisma/client';
import { AccountUseCase } from 'src/models/account';

@Injectable()
export class BudgetService extends BudgetUseCase {
	constructor(
		@Inject(BudgetRepositoryService)
		private readonly budgetRepository: BudgetRepository,

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
}

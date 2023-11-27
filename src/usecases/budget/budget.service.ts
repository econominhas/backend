import { Inject, Injectable } from '@nestjs/common';
import {
	BudgetUseCase,
	CreateBasicInput,
	CreateInput,
} from 'src/models/budget';
import { BudgetRepositoryService } from 'src/repositories/postgres/budget/budget-repository.service';
import { AccountService } from '../account/account.service';

@Injectable()
export class BudgetService extends BudgetUseCase {
	constructor(
		@Inject(BudgetRepositoryService)
		private readonly budgetRepository: BudgetRepositoryService,

		private readonly accountService: AccountService,
	) {
		super();
	}

	async create({
		accountId,
		name,
		description,
		year,
		items,
	}: CreateInput): Promise<void> {
		const itemsFormatted = items
			.map((item) =>
				item.items.map((categoryItem) => ({
					categoryId: item.categoryId,
					month: categoryItem.month,
					amount: categoryItem.amount,
					year,
				})),
			)
			.flat();

		const budget = await this.budgetRepository.createWithItems({
			accountId,
			name,
			description,
			items: itemsFormatted,
		});

		await this.accountService.setBudget({
			accountId,
			budgetId: budget.id,
		});
	}

	async createBasic({
		accountId,
		name,
		description,
		year,
		items,
	}: CreateBasicInput): Promise<void> {
		const itemsFormatted = items
			.map(({ categoryId, amount }) =>
				Array(12).map((_, idx) => ({
					categoryId,
					amount,
					year,
					month: idx + 1,
				})),
			)
			.flat();

		const budget = await this.budgetRepository.createWithItems({
			accountId,
			name,
			description,
			items: itemsFormatted,
		});

		await this.accountService.setBudget({
			accountId,
			budgetId: budget.id,
		});
	}
}

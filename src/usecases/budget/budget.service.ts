import { Inject, Injectable } from '@nestjs/common';
import {
	BudgetUseCase,
	CreateBasicInput,
	CreateInput,
} from 'src/models/budget';
import { BudgetRepositoryService } from 'src/repositories/postgres/budget/budget-repository.service';

@Injectable()
export class BudgetService extends BudgetUseCase {
	constructor(
		@Inject(BudgetRepositoryService)
		private readonly budgetRepository: BudgetRepositoryService,
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

		await this.budgetRepository.createWithItems({
			accountId,
			name,
			description,
			items: itemsFormatted,
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

		await this.budgetRepository.createWithItems({
			accountId,
			name,
			description,
			items: itemsFormatted,
		});
	}
}

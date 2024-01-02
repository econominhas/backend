import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository, Repository } from '..';
import type {
	CreateWithItemsInput,
	GetBudgetDateByIdInput,
	GetMonthlyByCategoryInput,
	GetMonthlyByCategoryOutput,
} from 'models/budget';
import { BudgetRepository } from 'models/budget';
import type { Budget, BudgetDate } from '@prisma/client';
import { IdAdapter } from 'adapters/id';
import { UIDAdapterService } from 'adapters/implementations/uid/uid.service';

@Injectable()
export class BudgetRepositoryService extends BudgetRepository {
	constructor(
		@InjectRepository('budget')
		private readonly budgetRepository: Repository<'budget'>,
		@InjectRepository('budgetDate')
		private readonly budgetDateRepository: Repository<'budgetDate'>,

		@Inject(UIDAdapterService)
		private readonly idAdapter: IdAdapter,
	) {
		super();
	}

	createWithItems({
		accountId,
		name,
		description,
		months,
	}: CreateWithItemsInput): Promise<Budget> {
		const budgetId = this.idAdapter.genId();

		return this.budgetRepository.create({
			data: {
				id: budgetId,
				accountId,
				name,
				description,
				budgetDates: {
					create: months.map(({ month, year, items }) => {
						const budgetDateId = this.idAdapter.genId();

						return {
							id: budgetDateId,
							budgetId,
							month,
							year,
							budgetItems: {
								create: items.map(({ categoryId, amount }) => ({
									budgetDateId: this.idAdapter.genId(),
									categoryId,
									amount,
								})),
							},
						};
					}),
				},
			},
		});
	}

	async getMonthlyByCategory({
		accountId,
		budgetId,
		month,
		year,
	}: GetMonthlyByCategoryInput): Promise<GetMonthlyByCategoryOutput> {
		const budget = await this.budgetRepository.findUnique({
			select: {
				budgetDates: {
					select: {
						budgetItems: {
							select: {
								categoryId: true,
								amount: true,
							},
						},
					},
				},
			},
			where: {
				id: budgetId,
				accountId,
				budgetDates: {
					every: {
						month,
						year,
					},
				},
			},
		});

		if (!budget) return;

		return budget.budgetDates.map((bd) => bd.budgetItems).flat();
	}

	getBudgetDateById({
		budgetDateId,
		accountId,
	}: GetBudgetDateByIdInput): Promise<BudgetDate> {
		return this.budgetDateRepository.findFirst({
			where: {
				id: budgetDateId,
				budget: {
					accountId,
				},
			},
		});
	}
}

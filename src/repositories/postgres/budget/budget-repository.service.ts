import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository, Repository } from '..';
import { UIDAdapter } from 'src/adapters/implementations/uid.service';
import type {
	CreateWithItemsInput,
	GetMonthlyBudgetByCategoryInput,
	GetMonthlyBudgetByCategoryOutput,
} from 'src/models/budget';
import { BudgetRepository } from 'src/models/budget';
import type { Budget } from '@prisma/client';
import { IdAdapter } from 'src/adapters/id';
import { DateAdapter } from 'src/adapters/date';
import { DayjsAdapter } from 'src/adapters/implementations/dayjs.service';

@Injectable()
export class BudgetRepositoryService extends BudgetRepository {
	constructor(
		@InjectRepository('budget')
		private readonly budgetRepository: Repository<'budget'>,
		@InjectRepository('budgetItem')
		private readonly budgetItemRepository: Repository<'budgetItem'>,

		@Inject(UIDAdapter)
		private readonly idAdapter: IdAdapter,
		@Inject(DayjsAdapter)
		private readonly dateAdapter: DateAdapter,
	) {
		super();
	}

	createWithItems({
		accountId,
		name,
		description,
		items,
	}: CreateWithItemsInput): Promise<Budget> {
		return this.budgetRepository.create({
			data: {
				id: this.idAdapter.genId(),
				accountId,
				name,
				description,
				budgetItems: {
					create: items.map(({ categoryId, month, year, amount }) => ({
						id: this.idAdapter.genId(),
						categoryId,
						month,
						year,
						amount,
					})),
				},
			},
		});
	}

	async getMonthlyBudgetByCategory({
		accountId,
		budgetId,
		timezone,
	}: GetMonthlyBudgetByCategoryInput): Promise<GetMonthlyBudgetByCategoryOutput> {
		const { month, year } = this.dateAdapter.getTodayInfo(timezone);

		const budget = await this.budgetRepository.findUnique({
			include: {
				budgetItems: {
					select: {
						amount: true,
					},
					include: {
						category: true,
					},
					where: {
						month,
						year,
					},
				},
			},
			where: {
				id: budgetId,
				accountId,
			},
		});

		if (!budget) return;

		return budget.budgetItems;
	}
}

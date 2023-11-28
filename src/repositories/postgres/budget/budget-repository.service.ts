import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository, Repository } from '..';
import { UIDAdapter } from 'src/adapters/implementations/uid.service';
import type {
	CreateWithItemsInput,
	GetMonthlyByCategoryInput,
	GetMonthlyByCategoryOutput,
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
		timezone,
		month: monthParam,
		year: yearParam,
	}: GetMonthlyByCategoryInput): Promise<GetMonthlyByCategoryOutput> {
		const { month, year } = this.dateAdapter.getTodayInfo(timezone);

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
						month: monthParam || month,
						year: yearParam || year,
					},
				},
			},
		});

		if (!budget) return;

		return budget.budgetDates.map((bd) => bd.budgetItems).flat();
	}
}

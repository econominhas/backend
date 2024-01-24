import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository, Repository } from '..';
import type {
	CreateWithItemsInput,
	GetBudgetDateByIdInput,
	GetMonthlyByCategoryInput,
	GetMonthlyByCategoryOutput,
	UpsertManyBudgetDatesInput,
} from 'models/budget';
import { BudgetRepository } from 'models/budget';
import type { Budget, BudgetDate } from '@prisma/client';
import { IdAdapter } from 'adapters/id';
import { UIDAdapterService } from 'adapters/implementations/uid/uid.service';
import { DateAdapter } from 'adapters/date';
import { DayjsAdapterService } from 'adapters/implementations/dayjs/dayjs.service';

@Injectable()
export class BudgetRepositoryService extends BudgetRepository {
	constructor(
		@InjectRepository('budget')
		private readonly budgetRepository: Repository<'budget'>,
		@InjectRepository('budgetDate')
		private readonly budgetDateRepository: Repository<'budgetDate'>,

		@Inject(DayjsAdapterService)
		private readonly dateAdapter: DateAdapter,
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
							date: this.dateAdapter.newDate(`${year}-${month}-01`),
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

	async upsertManyBudgetDates(
		i: UpsertManyBudgetDatesInput[],
	): Promise<BudgetDate[]> {
		const budgetId = i[0]?.budgetId;

		if (!budgetId) {
			return [];
		}

		const alreadyExistentDates = await this.budgetDateRepository
			.findMany({
				where: {
					budgetId,
					date: {
						in: i.map((bd) => bd.date),
					},
				},
				select: {
					date: true,
				},
			})
			.then((r) => r.map((bd) => bd.date.toISOString()));

		const budgetDates = i.filter(
			(bd) => !alreadyExistentDates.includes(bd.date.toISOString()),
		);

		await this.budgetDateRepository.createMany({
			data: budgetDates.map((budgetDate) => {
				return {
					...budgetDate,
					id: this.idAdapter.genId(),
				};
			}),
			skipDuplicates: true,
		});

		return this.budgetDateRepository.findMany({
			where: {
				budgetId,
				date: {
					in: i.map((cb) => cb.date),
				},
			},
			orderBy: {
				date: 'asc',
			},
		});
	}
}

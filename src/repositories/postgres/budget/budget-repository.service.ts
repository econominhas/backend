import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository, Repository } from '..';
import { UIDAdapter } from 'src/adapters/implementations/uid.service';
import type { CreateWithItemsInput } from 'src/models/budget';
import { BudgetRepository } from 'src/models/budget';
import type { Budget } from '@prisma/client';
import { IdAdapter } from 'src/adapters/id';

@Injectable()
export class BudgetRepositoryService extends BudgetRepository {
	constructor(
		@InjectRepository('budget')
		private readonly budgetRepository: Repository<'budget'>,

		@Inject(UIDAdapter)
		private readonly idAdapter: IdAdapter,
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
				id: this.idAdapter.gen(),
				accountId,
				name,
				description,
				budgetItems: {
					create: items.map(({ categoryId, month, year, amount }) => ({
						id: this.idAdapter.gen(),
						categoryId,
						month,
						year,
						amount,
					})),
				},
			},
		});
	}
}

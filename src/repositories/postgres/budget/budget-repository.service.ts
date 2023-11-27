import { Injectable } from '@nestjs/common';
import { InjectRepository, Repository } from '..';
import { UIDAdapter } from 'src/adapters/implementations/uid.service';
import { BudgetRepository, CreateWithItemsInput } from 'src/models/budget';
import { Budget } from '@prisma/client';

@Injectable()
export class BudgetRepositoryService extends BudgetRepository {
	constructor(
		@InjectRepository('budget')
		private readonly budgetRepository: Repository<'budget'>,

		private readonly idAdapter: UIDAdapter,
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

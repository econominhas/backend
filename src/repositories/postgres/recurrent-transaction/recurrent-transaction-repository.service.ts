import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository, Repository } from '..';
import type { RecurrentTransaction } from '@prisma/client';
import type { CreateInput } from 'src/models/recurrent-transaction';
import { RecurrentTransactionRepository } from 'src/models/recurrent-transaction';
import { IdAdapter } from 'src/adapters/id';
import { UIDAdapter } from 'src/adapters/implementations/uid.service';

@Injectable()
export class RecurrentTransactionRepositoryService extends RecurrentTransactionRepository {
	constructor(
		@InjectRepository('recurrentTransaction')
		private readonly recurrentTransactionRepository: Repository<'recurrentTransaction'>,

		@Inject(UIDAdapter)
		private readonly idAdapter: IdAdapter,
	) {
		super();
	}

	create({
		accountId,
		budgetId,
		isSystemManaged,
		// Data to create the transaction
		type,
		name,
		description,
		amount,
		isSystemManagedT,
		// Transaction type=IN,OUT
		paymentMethod,
		categoryId,
		cardId,
		bankAccountId,
		// Transaction type=TRANSFER
		bankAccountFromId,
		bankAccountToId,

		rules,
	}: CreateInput): Promise<RecurrentTransaction> {
		const recurrentTransactionId = this.idAdapter.genId();

		return this.recurrentTransactionRepository.create({
			data: {
				id: recurrentTransactionId,
				accountId,
				budgetId,
				isSystemManaged,
				// Data to create the transaction
				type,
				name,
				description,
				amount,
				isSystemManagedT,
				// Transaction type=IN,OUT
				paymentMethod,
				categoryId,
				cardId,
				bankAccountId,
				// Transaction type=TRANSFER
				bankAccountFromId,
				bankAccountToId,

				recurrentTransactionRules: {
					createMany: {
						data: rules.map(
							({
								caFormula,
								caParams,
								caConditions,

								frequency,
								fDaysOfWeeks,
								fDaysOfTheMonths,
								fMonths,
								fConditions,
							}) => ({
								id: this.idAdapter.genId(),
								recurrentTransactionId,

								caFormula,
								caParams: JSON.stringify(caParams),
								caConditions,

								frequency,
								fDaysOfWeeks,
								fDaysOfTheMonths,
								fMonths,
								fConditions,
							}),
						),
					},
				},
			},
		});
	}
}

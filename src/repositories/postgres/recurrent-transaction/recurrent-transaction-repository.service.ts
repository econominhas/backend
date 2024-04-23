import { Inject, Injectable } from "@nestjs/common";
import {
	RecurrenceFrequencyEnum,
	type RecurrentTransaction,
} from "@prisma/client";

import {
	RecurrentTransactionRepository,
	type CreateInput,
} from "models/recurrent-transaction";
import { IdAdapter } from "adapters/id";
import { type PaginatedRepository } from "types/paginated-items";
import { UlidAdapterService } from "adapters/implementations/ulid/ulid.service";

import { InjectRepository, Repository } from "..";

@Injectable()
export class RecurrentTransactionRepositoryService extends RecurrentTransactionRepository {
	constructor(
		@InjectRepository("recurrentTransaction")
		private readonly recurrentTransactionRepository: Repository<"recurrentTransaction">,

		@Inject(UlidAdapterService)
		private readonly idAdapter: IdAdapter,
	) {
		super();
	}

	create({
		accountId,
		budgetId,
		isSystemManaged,
		frequency,
		formulaToUse,
		startAt,
		endAt,
		baseAmounts,
		cCreates,
		cExcludes,
		cTryAgains,
		// Data to create the transaction
		type,
		name,
		description,
		isSystemManagedT,
		// Transaction type=IN,OUT,CREDIT
		categoryId,
		// Transaction type=CREDIT
		cardId,
		// Transaction type=IN,OUT
		bankAccountId,
		// Transaction type=TRANSFER
		bankAccountFromId,
		bankAccountToId,
	}: CreateInput): Promise<RecurrentTransaction> {
		const recurrentTransactionId = this.idAdapter.genId();

		return this.recurrentTransactionRepository.create({
			data: {
				id: recurrentTransactionId,
				accountId,
				budgetId,
				isSystemManaged,
				frequency,
				formulaToUse,
				startAt,
				endAt,
				baseAmounts,
				cCreates,
				cExcludes,
				cTryAgains,
				// Data to create the transaction
				type,
				name,
				description,
				isSystemManagedT,
				// Transaction type=IN,OUT,CREDIT
				categoryId,
				// Transaction type=CREDIT
				cardId,
				// Transaction type=IN,OUT
				bankAccountId,
				// Transaction type=TRANSFER
				bankAccountFromId,
				bankAccountToId,
			},
		});
	}

	findMonthly({
		limit,
		offset,
	}: PaginatedRepository): Promise<Array<RecurrentTransaction>> {
		return this.recurrentTransactionRepository.findMany({
			where: {
				frequency: RecurrenceFrequencyEnum.MONTHLY,
			},
			skip: offset,
			take: limit,
		});
	}

	findYearly({
		limit,
		offset,
	}: PaginatedRepository): Promise<Array<RecurrentTransaction>> {
		return this.recurrentTransactionRepository.findMany({
			where: {
				frequency: RecurrenceFrequencyEnum.YEARLY,
			},
			skip: offset,
			take: limit,
		});
	}
}

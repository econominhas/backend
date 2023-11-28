import { Inject, Injectable } from '@nestjs/common';
import {
	CaFormulaEnum,
	PaymentMethodEnum,
	RecurrenceConditionsEnum,
	RecurrenceFrequencyEnum,
	TransactionTypeEnum,
} from '@prisma/client';

import type { CreateSalaryInput } from 'src/models/recurrent-transaction';
import {
	RecurrentTransactionRepository,
	RecurrentTransactionUseCase,
} from 'src/models/recurrent-transaction';
import { RecurrentTransactionRepositoryService } from 'src/repositories/postgres/recurrent-transaction/recurrent-transaction-repository.service';

@Injectable()
export class RecurrentTransactionService extends RecurrentTransactionUseCase {
	constructor(
		@Inject(RecurrentTransactionRepositoryService)
		private readonly recurrentTransactionRepository: RecurrentTransactionRepository,
	) {
		super();
	}

	async createSalary({
		accountId,
		bankAccountId,
		budgetId,
		categoryId,
		amount,
		installments,
	}: CreateSalaryInput): Promise<void> {
		await this.recurrentTransactionRepository.create({
			accountId,
			budgetId,
			isSystemManaged: true,
			type: TransactionTypeEnum.IN,
			name: 'Salário',
			description: 'Valor recebido mensalmente pelo trabalho feito.',
			amount,
			isSystemManagedT: false,
			paymentMethod: PaymentMethodEnum.BANK_ACCOUNT,
			categoryId,
			bankAccountId,

			rules: [
				{
					caFormula: CaFormulaEnum.DPFET,
					caParams: {
						percentages: installments.map((r) => r.percentage),
					},
					caConditions: [
						RecurrenceConditionsEnum.IN_WEEKDAY,
						RecurrenceConditionsEnum.NOT_HOLIDAY,
						RecurrenceConditionsEnum.IF_NOT_BEFORE,
					],

					frequency: RecurrenceFrequencyEnum.MONTHLY,
					fDaysOfWeeks: [],
					fDaysOfTheMonths: installments.map((r) => String(r.dayOfTheMonth)),
					fMonths: [],
					fConditions: [
						RecurrenceConditionsEnum.IN_WEEKDAY,
						RecurrenceConditionsEnum.NOT_HOLIDAY,
						RecurrenceConditionsEnum.IF_NOT_BEFORE,
					],
				},
			],
		});
	}
}

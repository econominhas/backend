import { Inject, Injectable } from '@nestjs/common';
import type { RecurrentTransaction } from '@prisma/client';
import {
	CaFormulaEnum,
	RecurrenceConditionsEnum,
	RecurrenceFrequencyEnum,
	TransactionTypeEnum,
} from '@prisma/client';

import type {
	CreateCreditCardBillInput,
	CreateSalaryInput,
} from 'models/recurrent-transaction';
import {
	RecurrentTransactionRepository,
	RecurrentTransactionUseCase,
} from 'models/recurrent-transaction';
import { RecurrentTransactionRepositoryService } from 'repositories/postgres/recurrent-transaction/recurrent-transaction-repository.service';

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
					fParams: {
						daysOfTheMonth: installments.map((r) => String(r.dayOfTheMonth)),
					},
					fConditions: [
						RecurrenceConditionsEnum.IN_WEEKDAY,
						RecurrenceConditionsEnum.NOT_HOLIDAY,
						RecurrenceConditionsEnum.IF_NOT_BEFORE,
					],
				},
			],
		});
	}

	async createCreditCardBill({
		accountId,
		bankAccountId,
		card,
		budgetId,
		dueDay,
		statementDays,
		payAt,
	}: CreateCreditCardBillInput): Promise<RecurrentTransaction> {
		return this.recurrentTransactionRepository.create({
			accountId,
			budgetId,
			isSystemManaged: true,
			type: TransactionTypeEnum.OUT,
			name: `Fatura do cartão ${card.name}`,
			description: 'Pagamento da fatura do cartão de crédito',
			amount: 1,
			isSystemManagedT: false,
			bankAccountId,
			rules: [
				{
					caFormula: CaFormulaEnum.CCB,
					caParams: {
						dueDay,
						statementDays,
					},
					caConditions: [],

					frequency: RecurrenceFrequencyEnum.MONTHLY,
					fParams: {
						payAt,
						dueDay,
						statementDays,
					},
					fConditions: [
						RecurrenceConditionsEnum.IN_WEEKDAY,
						RecurrenceConditionsEnum.NOT_HOLIDAY,
						RecurrenceConditionsEnum.IF_NOT_AFTER,
					],
				},
			],
		});
	}
}

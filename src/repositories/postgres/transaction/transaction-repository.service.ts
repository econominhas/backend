import { Inject, Injectable } from "@nestjs/common";
import { TransactionTypeEnum } from "@prisma/client";

import {
	TransactionRepository,
	type CreateCreditInput,
	type CreateInOutInput,
	type CreateTransferInput,
	type GetByBudgetInput,
	type GetByBudgetOutput,
	type GetMonthlyAmountByCategoryInput,
	type GetMonthlyAmountByCategoryOutput,
} from "models/transaction";
import { IdAdapter } from "adapters/id";
import { UlidAdapterService } from "adapters/implementations/ulid/ulid.service";

import { InjectRepository, Repository } from "..";

@Injectable()
export class TransactionRepositoryService extends TransactionRepository {
	constructor(
		@InjectRepository("transaction")
		private readonly transactionRepository: Repository<"transaction">,

		@Inject(UlidAdapterService)
		private readonly idAdapter: IdAdapter,
	) {
		super();
	}

	async getMonthlyAmountByCategory({
		accountId,
		budgetId,
		month,
		year,
	}: GetMonthlyAmountByCategoryInput): Promise<GetMonthlyAmountByCategoryOutput> {
		const transactions = await this.transactionRepository.findMany({
			select: {
				amount: true,
				budgetDate: {
					select: {
						budgetItems: {
							select: {
								categoryId: true,
							},
						},
					},
				},
			},
			where: {
				accountId,
				budgetDate: {
					is: {
						budgetId,
						month,
						year,
					},
				},
			},
		});

		const expensesPerCategory: Record<
			string,
			{
				categoryId: string;
				amount: number;
			}
		> = {};

		for (const transaction of transactions) {
			const [{ categoryId }] = transaction.budgetDate.budgetItems;
			const { amount } = transaction;

			if (expensesPerCategory[categoryId]) {
				expensesPerCategory[categoryId] = {
					categoryId,
					amount,
				};
			} else {
				expensesPerCategory[categoryId].amount += amount;
			}
		}

		return Object.values(expensesPerCategory);
	}

	getByBudget({
		accountId,
		budgetId,
		month,
		year,
		limit,
		offset,
	}: GetByBudgetInput): Promise<Array<GetByBudgetOutput>> {
		return this.transactionRepository.findMany({
			select: {
				id: true,
				name: true,
				amount: true,
				type: true,
				installment: {
					select: {
						total: true,
						current: true,
					},
				},
				category: {
					select: {
						icon: true,
						color: true,
					},
				},
			},
			where: {
				accountId,
				budgetDate: {
					budgetId,
					month,
					year,
				},
			},
			orderBy: {
				createdAt: "desc",
			},
			skip: offset,
			take: limit,
		});
	}

	async createTransfer({
		accountId,
		name,
		amount,
		bankAccountFromId,
		bankAccountToId,
		budgetDateId,
		description,
		createdAt,
		isSystemManaged,
		recurrentTransactionId,
	}: CreateTransferInput): Promise<void> {
		await this.transactionRepository.create({
			data: {
				id: this.idAdapter.genId(),
				name,
				amount,
				description,
				createdAt,
				isSystemManaged,
				recurrentTransactionId,
				type: TransactionTypeEnum.TRANSFER,
				account: {
					connect: {
						id: accountId,
					},
				},
				bankAccountFrom: {
					connect: {
						id: bankAccountFromId,
					},
				},
				bankAccountTo: {
					connect: {
						id: bankAccountToId,
					},
				},
				budgetDate: {
					connect: {
						id: budgetDateId,
					},
				},
			},
		});
	}

	async createInOut({
		type,
		accountId,
		name,
		amount,
		categoryId,
		bankAccountId,
		budgetDateId,
		description,
		createdAt,
		isSystemManaged,
		recurrentTransactionId,
	}: CreateInOutInput): Promise<void> {
		await this.transactionRepository.create({
			data: {
				id: this.idAdapter.genId(),
				name,
				amount,
				description,
				createdAt,
				isSystemManaged,
				recurrentTransactionId,
				type,
				account: {
					connect: {
						id: accountId,
					},
				},
				bankAccount: {
					connect: {
						id: bankAccountId,
					},
				},
				budgetDate: {
					connect: {
						id: budgetDateId,
					},
				},
				category: {
					connect: {
						id: categoryId,
					},
				},
			},
		});
	}

	async createCredit({ common, unique }: CreateCreditInput): Promise<void> {
		await this.transactionRepository.createMany({
			data: unique.map(u => ({
				...common,
				...u,
				installment: {
					...common.installment,
					...u.installment,
				},
				type: TransactionTypeEnum.CREDIT,
				id: this.idAdapter.genId(),
			})),
			skipDuplicates: true,
		});
	}
}

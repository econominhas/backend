import {
	BadRequestException,
	InternalServerErrorException,
	Inject,
	Injectable,
} from "@nestjs/common";

import { IdAdapter } from "adapters/id";
import { UIDAdapterService } from "adapters/implementations/uid/uid.service";
import { UtilsAdapterService } from "adapters/implementations/utils/utils.service";
import { UtilsAdapter } from "adapters/utils";
import { BankRepository, BankUseCase } from "models/bank";
import { BudgetRepository, BudgetUseCase } from "models/budget";
import { CardRepository, CardUseCase } from "models/card";
import { CategoryRepository } from "models/category";
import {
	TransactionRepository,
	TransactionUseCase,
	type CreditInput,
	type GetByBudgetOutput,
	type GetListInput,
	type InOutInput,
	type TransferInput,
} from "models/transaction";
import { BankRepositoryService } from "repositories/postgres/bank/bank-repository.service";
import { BudgetRepositoryService } from "repositories/postgres/budget/budget-repository.service";
import { CardRepositoryService } from "repositories/postgres/card/card-repository.service";
import { CategoryRepositoryService } from "repositories/postgres/category/category-repository.service";
import { TransactionRepositoryService } from "repositories/postgres/transaction/transaction-repository.service";
import { BankService } from "usecases/bank/bank.service";
import { BudgetService } from "usecases/budget/budget.service";
import { CardService } from "usecases/card/card.service";
import { type PaginatedItems } from "types/paginated-items";

@Injectable()
export class TransactionService extends TransactionUseCase {
	constructor(
		@Inject(TransactionRepositoryService)
		private readonly transactionRepository: TransactionRepository,
		@Inject(BankRepositoryService)
		private readonly bankRepository: BankRepository,
		@Inject(BudgetRepositoryService)
		private readonly budgetRepository: BudgetRepository,
		@Inject(CardRepositoryService)
		private readonly cardRepository: CardRepository,
		@Inject(CategoryRepositoryService)
		private readonly categoryRepository: CategoryRepository,

		@Inject(BankService)
		private readonly bankService: BankUseCase,
		@Inject(BudgetService)
		private readonly budgetService: BudgetUseCase,
		@Inject(CardService)
		private readonly cardService: CardUseCase,

		@Inject(UIDAdapterService)
		private readonly idAdapter: IdAdapter,
		@Inject(UtilsAdapterService)
		private readonly utilsAdapter: UtilsAdapter,
	) {
		super();
	}

	async getList({
		accountId,
		budgetId,
		month,
		year,
		limit,
		page,
	}: GetListInput): Promise<PaginatedItems<GetByBudgetOutput>> {
		const { paging, ...pagParams } = this.utilsAdapter.pagination({
			limit,
			page,
		});

		const data = await this.transactionRepository.getByBudget({
			...pagParams,
			accountId,
			budgetId,
			month,
			year,
		});

		return {
			paging,
			data,
		};
	}

	async transfer({
		accountId,
		name,
		amount,
		bankAccountFromId,
		bankAccountToId,
		budgetDateId,
		description,
		createdAt,
		isSystemManaged = false,
		recurrentTransactionId,
	}: TransferInput): Promise<void> {
		const [bankAccounts, budgetDate] = await Promise.all([
			this.bankRepository.getManyById({
				bankAccountsIds: [bankAccountFromId, bankAccountToId],
				accountId,
			}),
			this.budgetRepository.getBudgetDateById({
				budgetDateId,
				accountId,
			}),
		]);

		const bankAccountFrom = bankAccounts.find(b => b.id === bankAccountFromId);
		const bankAccountTo = bankAccounts.find(b => b.id === bankAccountToId);

		if (!bankAccountFrom) {
			throw new BadRequestException("Invalid bankAccountFrom");
		}

		if (!bankAccountTo) {
			throw new BadRequestException("Invalid bankAccountTo");
		}

		if (!budgetDate) {
			throw new BadRequestException("Invalid budgetDate");
		}

		/**
		 * 1- First creates the bank account transfer,
		 * to ensure that the user has the necessary
		 * requirements to do this transaction
		 */
		await this.bankService.transfer({
			accountId,
			bankAccountFromId,
			bankAccountToId,
			amount,
		});

		/**
		 * 2- Then, creates the transaction
		 */
		await this.transactionRepository.createTransfer({
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
		});
	}

	async inOut({
		type,
		accountId,
		name,
		amount,
		categoryId,
		bankAccountId,
		budgetDateId,
		description,
		createdAt,
		isSystemManaged = false,
		recurrentTransactionId,
	}: InOutInput): Promise<void> {
		const [bankAccount, category, budgetDate] = await Promise.all([
			this.bankRepository.getById({
				bankAccountId,
				accountId,
			}),
			this.categoryRepository.getById({
				categoryId,
				accountId,
				active: true,
			}),
			this.budgetRepository.getBudgetDateById({
				budgetDateId,
				accountId,
			}),
		]);

		if (!bankAccount) {
			throw new BadRequestException("Invalid bankAccount");
		}

		if (!category) {
			throw new BadRequestException("Invalid category");
		}

		if (!budgetDate) {
			throw new BadRequestException("Invalid budgetDate");
		}

		/**
		 * 1- First adds/removes the funds to the bank account,
		 * to ensure that the user has the necessary
		 * requirements to do this transaction
		 */
		await this.bankService.inOut({
			type,
			accountId,
			bankAccountId,
			amount,
		});

		/**
		 * 2- Then, creates the transaction
		 */
		await this.transactionRepository.createInOut({
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
		});
	}

	async credit({
		accountId,
		name,
		description,
		amount,
		installments,
		categoryId,
		cardId,
		budgetDateId,
		createdAt,
		isSystemManaged = false,
		recurrentTransactionId,
	}: CreditInput): Promise<void> {
		const [card, category, budgetDate] = await Promise.all([
			this.cardRepository.getById({
				cardId,
				accountId,
			}),
			this.categoryRepository.getById({
				categoryId,
				accountId,
				active: true,
			}),
			this.budgetRepository.getBudgetDateById({
				budgetDateId,
				accountId,
			}),
		]);

		if (!card) {
			throw new BadRequestException("Invalid card");
		}

		if (!category) {
			throw new BadRequestException("Invalid category");
		}

		if (!budgetDate) {
			throw new BadRequestException("Invalid budgetDate");
		}

		/*
		 * Create credit card bills and budgetDates if they
		 * don't exist
		 * OBS: this should be done elsewhere, but since we
		 * are poor and a very small team, we do it here
		 */
		const [cardBills, budgetDates] = await Promise.all([
			this.cardService.createNextCardBills({
				cardId,
				accountId,
				amount: installments,
			}),
			this.budgetService.createNextBudgetDates({
				startFrom: budgetDate,
				amount: installments,
			}),
		]);

		if (cardBills.length !== installments) {
			throw new InternalServerErrorException("Fail to create card bills");
		}

		if (budgetDates.length !== installments) {
			throw new InternalServerErrorException("Fail to create budgets");
		}

		// Create multiple transactions with their installment
		const installmentGroupId = this.idAdapter.genId();
		await this.transactionRepository.createCredit({
			common: {
				accountId,
				name,
				amount,
				categoryId,
				cardId,
				description,
				createdAt,
				isSystemManaged,
				recurrentTransactionId,
				installment: {
					installmentGroupId,
					total: installments,
				},
			},
			unique: cardBills.map(({ id }, idx) => ({
				budgetDateId: budgetDates[idx].id,
				installment: {
					current: idx + 1,
					cardBillId: id,
				},
			})),
		});
	}
}

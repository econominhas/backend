import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import {
	TransactionTypeEnum,
	type BankAccount,
	type BankProvider,
} from "@prisma/client";

import { UtilsAdapterService } from "adapters/implementations/utils/utils.service";
import { UtilsAdapter } from "adapters/utils";
import {
	BankUseCase,
	type CreateInput,
	type InOutInput,
	type ListInput,
	type TransferInput,
} from "models/bank";
import { BankRepositoryService } from "repositories/postgres/bank/bank-repository.service";
import { type Paginated, type PaginatedItems } from "types/paginated-items";

@Injectable()
export class BankService extends BankUseCase {
	constructor(
		@Inject(BankRepositoryService)
		private readonly bankRepository: BankRepositoryService,

		@Inject(UtilsAdapterService)
		private readonly utilsAdapter: UtilsAdapter,
	) {
		super();
	}

	async getProviders(i: Paginated): Promise<PaginatedItems<BankProvider>> {
		const { paging, ...pagParams } = this.utilsAdapter.pagination(i);

		const data = await this.bankRepository.getProviders(pagParams);

		return {
			paging,
			data,
		};
	}

	create(i: CreateInput): Promise<BankAccount> {
		return this.bankRepository.create(i);
	}

	async list({
		accountId,
		...pagination
	}: ListInput): Promise<PaginatedItems<BankAccount>> {
		const { limit, offset, paging } = this.utilsAdapter.pagination(pagination);

		const data = await this.bankRepository.getByUser({
			accountId,
			limit,
			offset,
		});

		return {
			paging,
			data,
		};
	}

	async transfer({
		accountId,
		bankAccountFromId,
		bankAccountToId,
		amount,
	}: TransferInput): Promise<void> {
		/**
		 * This is a double validation, because it's extremely
		 * important that this value is ONLY positive
		 */
		if (amount <= 0) {
			throw new BadRequestException("amount must be bigger than 0");
		}

		const bankAccountFrom = await this.bankRepository.getById({
			bankAccountId: bankAccountFromId,
			accountId,
		});

		if (!bankAccountFrom) {
			throw new NotFoundException("Bank account not found");
		}

		if (bankAccountFrom.balance < amount) {
			throw new BadRequestException("No funds to perform this action");
		}

		await Promise.all([
			this.bankRepository.incrementBalance({
				bankAccountId: bankAccountFromId,
				accountId,
				amount: amount * -1,
			}),
			this.bankRepository.incrementBalance({
				bankAccountId: bankAccountToId,
				accountId,
				amount,
			}),
		]);
	}

	async inOut({
		type,
		accountId,
		bankAccountId,
		amount,
	}: InOutInput): Promise<void> {
		/**
		 * This is a double validation, because it's extremely
		 * important that this value is ONLY positive
		 */
		if (amount <= 0) {
			throw new BadRequestException("amount must be bigger than 0");
		}

		if (type === TransactionTypeEnum.IN) {
			await this.bankRepository.incrementBalance({
				bankAccountId,
				accountId,
				amount,
			});
		} else {
			await this.bankRepository.incrementBalance({
				bankAccountId,
				accountId,
				amount: amount * -1,
			});
		}
	}
}

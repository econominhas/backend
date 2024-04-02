import {
	ConflictException,
	Inject,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from "@nestjs/common";
import { type BankAccount, type BankProvider } from "@prisma/client";

import {
	BankRepository,
	type CreateInput,
	type GetBalanceByUserInput,
	type GetByIdInput,
	type GetByUserInput,
	type GetManyByIdInput,
	type IncrementBalanceInput,
} from "models/bank";
import { IdAdapter } from "adapters/id";
import { UIDAdapterService } from "adapters/implementations/uid/uid.service";
import { type PaginatedRepository } from "types/paginated-items";

import { InjectRepository, Repository } from "..";

@Injectable()
export class BankRepositoryService extends BankRepository {
	constructor(
		@InjectRepository("bankProvider")
		private readonly bankProviderRepository: Repository<"bankProvider">,
		@InjectRepository("bankAccount")
		private readonly bankAccountRepository: Repository<"bankAccount">,

		@Inject(UIDAdapterService)
		private readonly idAdapter: IdAdapter,
	) {
		super();
	}

	getProviders({
		offset,
		limit,
	}: PaginatedRepository): Promise<Array<BankProvider>> {
		return this.bankProviderRepository.findMany({
			orderBy: {
				name: "asc",
			},
			skip: offset,
			take: limit,
		});
	}

	create({
		accountId,
		bankProviderId,
		name,
		accountNumber,
		branch,
		balance,
	}: CreateInput): Promise<BankAccount> {
		try {
			return this.bankAccountRepository.create({
				data: {
					id: this.idAdapter.genId(),
					accountId,
					bankProviderId,
					name,
					accountNumber,
					branch,
					balance,
				},
			});
		} catch (err) {
			// https://www.prisma.io/docs/reference/api-reference/error-reference#p2003
			if (err.code === "P2003") {
				throw new NotFoundException("Bank provider doesn't exists");
			}
			// https://www.prisma.io/docs/reference/api-reference/error-reference#p2004
			if (err.code === "P2004") {
				throw new ConflictException("Bank account already exists");
			}

			throw new InternalServerErrorException(
				`Fail to create bank account: ${err.message}`,
			);
		}
	}

	async getBalanceByUser({
		accountId,
	}: GetBalanceByUserInput): Promise<number> {
		const r = await this.bankAccountRepository.aggregate({
			_sum: {
				balance: true,
			},
			where: {
				accountId,
			},
		});

		return r._sum.balance;
	}

	getByUser({
		accountId,
		limit,
		offset,
	}: GetByUserInput): Promise<Array<BankAccount>> {
		return this.bankAccountRepository.findMany({
			where: {
				accountId,
			},
			orderBy: {
				name: "asc",
			},
			take: limit,
			skip: offset,
		});
	}

	getById({
		bankAccountId,
		accountId,
	}: GetByIdInput): Promise<BankAccount | null> {
		return this.bankAccountRepository.findFirst({
			where: {
				id: bankAccountId,
				accountId,
			},
		});
	}

	getManyById({
		bankAccountsIds,
		accountId,
	}: GetManyByIdInput): Promise<Array<BankAccount> | null> {
		return this.bankAccountRepository.findMany({
			where: {
				id: {
					in: bankAccountsIds,
				},
				accountId,
			},
		});
	}

	async incrementBalance({
		bankAccountId,
		accountId,
		amount,
	}: IncrementBalanceInput): Promise<void> {
		await this.bankAccountRepository.update({
			where: {
				id: bankAccountId,
				accountId,
			},
			data: {
				balance:
					amount < 0
						? {
								decrement: amount * -1,
							}
						: {
								increment: amount,
							},
			},
		});
	}
}

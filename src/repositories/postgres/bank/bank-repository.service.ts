import {
	ConflictException,
	Inject,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository, Repository } from '..';
import type { BankAccount, BankProvider } from '@prisma/client';
import type { PaginatedRepository } from 'types/paginated-items';
import type {
	CreateInput,
	GetBalanceByUserInput,
	GetByIdInput,
	GetByUserInput,
	GetManyByIdInput,
	UpdateBalanceInput,
} from 'models/bank';
import { BankRepository } from 'models/bank';
import { IdAdapter } from 'adapters/id';
import { UIDAdapterService } from 'adapters/implementations/uid/uid.service';

@Injectable()
export class BankRepositoryService extends BankRepository {
	constructor(
		@InjectRepository('bankProvider')
		private readonly bankProviderRepository: Repository<'bankProvider'>,
		@InjectRepository('bankAccount')
		private readonly bankAccountRepository: Repository<'bankAccount'>,

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
				name: 'asc',
			},
			skip: offset,
			take: limit,
		});
	}

	async create({
		accountId,
		bankProviderId,
		name,
		accountNumber,
		branch,
		balance,
	}: CreateInput): Promise<BankAccount> {
		try {
			const bankAccount = await this.bankAccountRepository.create({
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

			return bankAccount;
		} catch (err) {
			// https://www.prisma.io/docs/reference/api-reference/error-reference#p2003
			if (err.code === 'P2003') {
				throw new NotFoundException("Bank provider doesn't exists");
			}
			// https://www.prisma.io/docs/reference/api-reference/error-reference#p2004
			if (err.code === 'P2004') {
				throw new ConflictException('Bank account already exists');
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
	}: GetByUserInput): Promise<BankAccount[]> {
		return this.bankAccountRepository.findMany({
			where: {
				accountId,
			},
			orderBy: {
				name: 'asc',
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
	}: GetManyByIdInput): Promise<BankAccount[] | null> {
		return this.bankAccountRepository.findMany({
			where: {
				id: {
					in: bankAccountsIds,
				},
				accountId,
			},
		});
	}

	async updateBalance({
		bankAccountId,
		accountId,
		amount,
	}: UpdateBalanceInput): Promise<void> {
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

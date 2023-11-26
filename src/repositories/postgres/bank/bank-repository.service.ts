import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository, Repository } from '..';
import { BankAccount, BankProvider } from '@prisma/client';
import { PaginatedRepository } from 'src/types/paginated-items';
import { BankRepository, CreateInput } from 'src/models/bank';
import { UIDAdapter } from 'src/adapters/implementations/uid.service';

@Injectable()
export class BankRepositoryService extends BankRepository {
	constructor(
		@InjectRepository('bankProvider')
		private readonly bankProviderRepository: Repository<'bankProvider'>,
		@InjectRepository('bankAccount')
		private readonly bankAccountRepository: Repository<'bankAccount'>,

		private readonly idAdapter: UIDAdapter,
	) {
		super();
	}

	getProviders({
		offset,
		limit,
	}: PaginatedRepository): Promise<Array<BankProvider>> {
		return this.bankProviderRepository.findMany({
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
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				//@ts-ignore
				data: {
					id: this.idAdapter.gen(),
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
}

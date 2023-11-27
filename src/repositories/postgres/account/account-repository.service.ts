import { Injectable } from '@nestjs/common';
import {
	AccountRepository,
	GetByIdInput,
	GetByIdWithProvidersInput,
	GetByIdWithProvidersOutput,
	UpdateNameInput,
} from 'src/models/account';
import { InjectRepository, Repository } from '..';
import { Account } from '@prisma/client';

@Injectable()
export class AccountRepositoryService extends AccountRepository {
	constructor(
		@InjectRepository('account')
		private readonly accountRepository: Repository<'account'>,
		@InjectRepository('config')
		private readonly configRepository: Repository<'config'>,
	) {
		super();
	}

	async getById({ id }: GetByIdInput): Promise<undefined | Account> {
		return this.accountRepository.findUnique({
			where: {
				id,
			},
		});
	}

	async getByIdWithProviders({
		id,
	}: GetByIdWithProvidersInput): Promise<
		undefined | GetByIdWithProvidersOutput
	> {
		return this.accountRepository.findUnique({
			include: {
				signInProviders: true,
			},
			where: {
				id,
			},
		});
	}

	async updateName({ accountId, name }: UpdateNameInput): Promise<void> {
		await this.configRepository.update({
			where: {
				accountId,
			},
			data: {
				name,
			},
		});
	}
}

import { Injectable } from '@nestjs/common';
import type {
	GetByIdInput,
	GetByIdWithProvidersInput,
	GetByIdWithProvidersOutput,
	UpdateConfigInput,
} from 'models/account';
import { AccountRepository } from 'models/account';
import { InjectRepository, Repository } from '..';
import type { Account } from '@prisma/client';

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

	async updateConfig({
		accountId,
		name,
		currentBudgetId,
		salaryId,
	}: UpdateConfigInput): Promise<void> {
		await this.configRepository.update({
			where: {
				accountId,
			},
			data: {
				name,
				currentBudgetId,
				salaryId,
			},
		});
	}
}

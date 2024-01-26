import { Injectable } from '@nestjs/common';
import type {
	GetByIdInput,
	GetByIdWithProvidersInput,
	GetByIdWithProvidersOutput,
	GetOnboardingRecordInput,
	UpdateConfigInput,
	UpdateOnboardingRecordInput,
} from 'models/account';
import { AccountRepository } from 'models/account';
import { InjectRepository, Repository } from '..';
import type { Account, Onboarding } from '@prisma/client';
import { cleanObj } from '@techmmunity/utils';

@Injectable()
export class AccountRepositoryService extends AccountRepository {
	constructor(
		@InjectRepository('account')
		private readonly accountRepository: Repository<'account'>,
		@InjectRepository('config')
		private readonly configRepository: Repository<'config'>,
		@InjectRepository('onboarding')
		private readonly onboardingRepository: Repository<'onboarding'>,
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

	async getOnboarding({
		accountId,
	}: GetOnboardingRecordInput): Promise<void | Onboarding> {
		return this.onboardingRepository.findUnique({
			where: {
				id: accountId,
			},
		});
	}

	async updateOnboarding({
		accountId,
		...data
	}: UpdateOnboardingRecordInput): Promise<void> {
		this.onboardingRepository.update({
			where: {
				id: accountId,
			},
			data: cleanObj(data),
		});
	}
}

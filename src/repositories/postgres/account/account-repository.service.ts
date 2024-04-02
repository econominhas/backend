import { Injectable } from "@nestjs/common";
import { type Account, type Onboarding } from "@prisma/client";
import { cleanObj } from "@techmmunity/utils";

import {
	AccountRepository,
	type GetByIdInput,
	type GetByIdWithProvidersInput,
	type GetByIdWithProvidersOutput,
	type GetOnboardingRecordInput,
	type UpdateConfigInput,
	type UpdateOnboardingRecordInput,
} from "models/account";

import { InjectRepository, Repository } from "..";

@Injectable()
export class AccountRepositoryService extends AccountRepository {
	constructor(
		@InjectRepository("account")
		private readonly accountRepository: Repository<"account">,
		@InjectRepository("config")
		private readonly configRepository: Repository<"config">,
		@InjectRepository("onboarding")
		private readonly onboardingRepository: Repository<"onboarding">,
	) {
		super();
	}

	getById({ id }: GetByIdInput): Promise<Account | undefined> {
		return this.accountRepository.findUnique({
			where: {
				id,
			},
		});
	}

	getByIdWithProviders({
		id,
	}: GetByIdWithProvidersInput): Promise<
		GetByIdWithProvidersOutput | undefined
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
	}: UpdateConfigInput): Promise<void> {
		await this.configRepository.update({
			where: {
				accountId,
			},
			data: {
				name,
				currentBudgetId,
			},
		});
	}

	getOnboarding({
		accountId,
	}: GetOnboardingRecordInput): Promise<Onboarding | void> {
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
		await this.onboardingRepository.update({
			where: {
				id: accountId,
			},
			data: cleanObj(data),
		});
	}
}

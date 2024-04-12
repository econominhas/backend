import { Injectable } from "@nestjs/common";
import { type Account } from "@prisma/client";

import {
	AccountRepository,
	type GetByIdInput,
	type GetByIdWithProvidersInput,
	type GetByIdWithProvidersOutput,
	type UpdateConfigInput,
} from "models/account";

import { InjectRepository, Repository } from "..";

@Injectable()
export class AccountRepositoryService extends AccountRepository {
	constructor(
		@InjectRepository("account")
		private readonly accountRepository: Repository<"account">,
		@InjectRepository("config")
		private readonly configRepository: Repository<"config">,
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
}

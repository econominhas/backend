import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { SignInProviderEnum } from "@prisma/client";
import {
	AccountUseCase,
	type IamInput,
	type IamOutput,
	type SetBudgetInput,
	type SetSalaryInput,
	type UpdateNameInput,
} from "src/models/account";
import { AccountRepositoryService } from "src/repositories/postgres/account/account-repository.service";

@Injectable()
export class AccountService extends AccountUseCase {
	constructor(
		@Inject(AccountRepositoryService)
		private readonly accountRepository: AccountRepositoryService,
	) {
		super();
	}

	async iam({ accountId }: IamInput): Promise<IamOutput> {
		const account = await this.accountRepository.getByIdWithProviders({
			id: accountId,
		});

		if (!account) {
			throw new UnauthorizedException("User not found");
		}

		const google = account.signInProviders.find(
			p => p.provider === SignInProviderEnum.GOOGLE,
		);

		return {
			id: accountId,
			googleId: google.providerId,
		};
	}

	async updateName(i: UpdateNameInput): Promise<void> {
		await this.accountRepository.updateConfig(i);
	}

	async setBudget({ accountId, budgetId }: SetBudgetInput): Promise<void> {
		await this.accountRepository.updateConfig({
			accountId,
			currentBudgetId: budgetId,
		});
	}

	async setSalary({ accountId, salaryId }: SetSalaryInput): Promise<void> {
		await this.accountRepository.updateConfig({
			accountId,
			salaryId,
		});
	}
}

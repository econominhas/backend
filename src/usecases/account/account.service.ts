import {
	Inject,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";
import { SignInProviderEnum } from "@prisma/client";

import {
	AccountUseCase,
	type GetOnboardingInput,
	type GetOnboardingOutput,
	type IamInput,
	type IamOutput,
	type SetBudgetInput,
	type UpdateNameInput,
	type UpdateOnboardingInput,
	type UpdateOnboardingRecordInput,
} from "models/account";
import { AccountRepositoryService } from "repositories/postgres/account/account-repository.service";
import { DateAdapter } from "adapters/date";
import { DayjsAdapterService } from "adapters/implementations/dayjs/dayjs.service";

@Injectable()
export class AccountService extends AccountUseCase {
	constructor(
		@Inject(AccountRepositoryService)
		private readonly accountRepository: AccountRepositoryService,

		@Inject(DayjsAdapterService)
		private readonly dateAdapter: DateAdapter,
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
			googleId: google?.providerId,
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

	async getOnboarding({
		accountId,
	}: GetOnboardingInput): Promise<GetOnboardingOutput> {
		const onboarding = await this.accountRepository.getOnboarding({
			accountId,
		});

		if (!onboarding) {
			throw new NotFoundException("User not found");
		}

		const entries = Object.entries(onboarding);

		return entries.reduce((acc, [key, value]) => {
			if (value) {
				acc[key] = true;
			}

			return acc;
		}, {} as GetOnboardingOutput);
	}

	async updateOnboarding({
		accountId,
		...data
	}: UpdateOnboardingInput): Promise<void> {
		const entries = Object.entries(data);

		const date = this.dateAdapter.newDate();

		const toUpdate = entries.reduce((acc, [key, value]) => {
			if (value) {
				acc[key] = date;
			}

			return acc;
		}, {} as UpdateOnboardingRecordInput);

		await this.accountRepository.updateOnboarding({
			accountId,
			...toUpdate,
		});
	}
}

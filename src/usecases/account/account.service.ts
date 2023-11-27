import { AccountRepositoryService } from 'src/repositories/postgres/account/account-repository.service';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import {
	AccountUseCase,
	IamInput,
	IamOutput,
	UpdateNameInput,
} from 'src/models/account';
import { SignInProviderEnum } from '@prisma/client';

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
			throw new UnauthorizedException('User not found');
		}

		const google = account.signInProviders.find(
			(p) => p.provider === SignInProviderEnum.GOOGLE,
		);

		return {
			id: accountId,
			googleId: google.providerId,
		};
	}

	async updateName(i: UpdateNameInput): Promise<void> {
		await this.accountRepository.updateName(i);
	}
}

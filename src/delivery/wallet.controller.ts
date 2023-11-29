import { Controller, Get, Inject } from '@nestjs/common';
import { UserDataDto } from './dtos';
import { UserData } from './decorators/user-data';
import { WalletService } from 'src/usecases/wallet/wallet.service';
import { WalletUseCase } from 'src/models/wallet';

@Controller('wallet')
export class WalletController {
	constructor(
		@Inject(WalletService)
		private readonly walletService: WalletUseCase,
	) {}

	@Get('/balance')
	balanceOverview(
		@UserData()
		userData: UserDataDto,
	) {
		return this.walletService.balanceOverview({
			accountId: userData.accountId,
		});
	}
}

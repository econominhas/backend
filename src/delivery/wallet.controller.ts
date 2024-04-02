import { Controller, Get, Inject } from "@nestjs/common";

import { WalletService } from "usecases/wallet/wallet.service";
import { WalletUseCase } from "models/wallet";

import { UserDataDto } from "./dtos";
import { UserData } from "./decorators/user-data";

@Controller("wallet")
export class WalletController {
	constructor(
		@Inject(WalletService)
		private readonly walletService: WalletUseCase,
	) {}

	@Get("/balance")
	balanceOverview(
		@UserData()
		userData: UserDataDto,
	) {
		return this.walletService.balanceOverview({
			accountId: userData.accountId,
		});
	}
}

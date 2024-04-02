import { Controller, Inject, Get, Query, Body, Post } from "@nestjs/common";

import { TransactionService } from "usecases/transaction/transaction.service";
import { TransactionUseCase } from "models/transaction";

import { UserData } from "./decorators/user-data";
import { UserDataDto } from "./dtos";
import {
	CreditDto,
	GetListDto,
	InOutDto,
	TransferDto,
} from "./dtos/transaction";

@Controller("transactions")
export class TransactionController {
	constructor(
		@Inject(TransactionService)
		private readonly transactionService: TransactionUseCase,
	) {}

	@Get("/")
	getList(
		@UserData()
		userData: UserDataDto,
		@Query()
		query: GetListDto,
	) {
		return this.transactionService.getList({
			...query,
			accountId: userData.accountId,
		});
	}

	@Post("/transfer")
	transfer(
		@UserData()
		userData: UserDataDto,
		@Body()
		body: TransferDto,
	) {
		return this.transactionService.transfer({
			...body,
			accountId: userData.accountId,
		});
	}

	@Post("/in-out")
	inOut(
		@UserData()
		userData: UserDataDto,
		@Body()
		body: InOutDto,
	) {
		return this.transactionService.inOut({
			...body,
			accountId: userData.accountId,
		});
	}

	@Post("/credit")
	credit(
		@UserData()
		userData: UserDataDto,
		@Body()
		body: CreditDto,
	) {
		return this.transactionService.credit({
			...body,
			accountId: userData.accountId,
		});
	}
}

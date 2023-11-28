import { Body, Controller, Get, Inject, Post, Query } from "@nestjs/common";
import { BankUseCase } from "src/models/bank";
import { BankService } from "src/usecases/bank/bank.service";

import { UserData } from "./decorators/user-data";
import { PaginatedDto, UserDataDto } from "./dtos";
import { CreateDto } from "./dtos/bank";

@Controller("banks")
export class BankController {
	constructor(
		@Inject(BankService)
		private readonly bankService: BankUseCase,
	) {}

	@Get("/providers")
	getDefault(
		@Query()
		pagination: PaginatedDto,
	) {
		return this.bankService.getProviders(pagination);
	}

	@Post("accounts")
	create(
		@UserData()
		userData: UserDataDto,
		@Body()
		body: CreateDto,
	) {
		return this.bankService.create({
			...body,
			accountId: userData.accountId,
		});
	}
}

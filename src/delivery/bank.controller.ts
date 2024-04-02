import { Body, Controller, Get, Inject, Post, Query } from "@nestjs/common";

import { BankService } from "usecases/bank/bank.service";
import { BankUseCase } from "models/bank";

import { PaginatedDto, UserDataDto } from "./dtos";
import { UserData } from "./decorators/user-data";
import { CreateDto } from "./dtos/bank";

@Controller("banks")
export class BankController {
	constructor(
		@Inject(BankService)
		private readonly bankService: BankUseCase,
	) {}

	@Get("/providers")
	getProviders(
		@Query()
		pagination: PaginatedDto,
	) {
		return this.bankService.getProviders(pagination);
	}

	@Post("/accounts")
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

	@Get("/accounts")
	list(
		@UserData()
		userData: UserDataDto,
		@Query()
		pagination: PaginatedDto,
	) {
		return this.bankService.list({
			...pagination,
			accountId: userData.accountId,
		});
	}
}

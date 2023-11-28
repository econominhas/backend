import { Body, Controller, Inject, Post } from "@nestjs/common";
import { BudgetUseCase } from "src/models/budget";
import { BudgetService } from "src/usecases/budget/budget.service";

import { UserData } from "./decorators/user-data";
import { UserDataDto } from "./dtos";
import { CreateBasicDto, CreateDto } from "./dtos/budget";

@Controller("budgets")
export class BudgetController {
	constructor(
		@Inject(BudgetService)
		private readonly budgetService: BudgetUseCase,
	) {}

	@Post("")
	create(
		@UserData()
		userData: UserDataDto,
		@Body()
		body: CreateDto,
	) {
		return this.budgetService.create({
			...body,
			accountId: userData.accountId,
		});
	}

	@Post("basic")
	createBasic(
		@UserData()
		userData: UserDataDto,
		@Body()
		body: CreateBasicDto,
	) {
		return this.budgetService.createBasic({
			...body,
			accountId: userData.accountId,
		});
	}
}

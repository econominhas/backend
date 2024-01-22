import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { UserDataDto } from './dtos';
import { UserData } from './decorators/user-data';
import { BudgetService } from 'usecases/budget/budget.service';
import { CreateBasicDto, CreateDto, OverviewDtoDto } from './dtos/budget';
import { BudgetUseCase } from 'models/budget';

@Controller('budgets')
export class BudgetController {
	constructor(
		@Inject(BudgetService)
		private readonly budgetService: BudgetUseCase,
	) {}

	@Post('/')
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

	@Post('/basic')
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

	@Get('/overview')
	overview(
		@UserData()
		userData: UserDataDto,
		@Query()
		query: OverviewDtoDto,
	) {
		return this.budgetService.overview({
			...query,
			accountId: userData.accountId,
		});
	}
}

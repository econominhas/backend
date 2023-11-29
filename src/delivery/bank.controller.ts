import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { PaginatedDto, UserDataDto } from './dtos';
import { BankService } from 'src/usecases/bank/bank.service';
import { UserData } from './decorators/user-data';
import { CreateDto } from './dtos/bank';
import { BankUseCase } from 'src/models/bank';

@Controller('banks')
export class BankController {
	constructor(
		@Inject(BankService)
		private readonly bankService: BankUseCase,
	) {}

	@Get('/providers')
	getProviders(
		@Query()
		pagination: PaginatedDto,
	) {
		return this.bankService.getProviders(pagination);
	}

	@Post('accounts')
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

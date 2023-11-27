import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PaginatedDto, UserDataDto } from './dtos';
import { BankService } from 'src/usecases/bank/bank.service';
import { UserData } from './decorators/user-data';
import { CreateDto } from './dtos/bank';

@Controller('banks')
export class BankController {
	constructor(private readonly bankService: BankService) {}

	@Get('/providers')
	getDefault(
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

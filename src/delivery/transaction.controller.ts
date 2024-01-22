import { Controller, Inject, Get, Query, Body, Post } from '@nestjs/common';
import { UserData } from './decorators/user-data';
import { UserDataDto } from './dtos';
import { GetListDto, InOutDto, TransferDto } from './dtos/transaction';
import { TransactionService } from 'usecases/transaction/transaction.service';
import { TransactionUseCase } from 'models/transaction';

@Controller('transactions')
export class TransactionController {
	constructor(
		@Inject(TransactionService)
		private readonly transactionService: TransactionUseCase,
	) {}

	@Get('/')
	async getList(
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

	@Post('/transfer')
	async transfer(
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

	@Post('/in-out')
	async inOut(
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
}

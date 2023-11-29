import { Controller, Inject, Get, Query } from '@nestjs/common';
import { UserData } from './decorators/user-data';
import { UserDataDto } from './dtos';
import { GetListDto } from './dtos/transaction';
import { TransactionService } from 'src/usecases/transaction/transaction.service';
import { TransactionUseCase } from 'src/models/transaction';

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
}

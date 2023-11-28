import {
	Controller,
	Inject,
	HttpCode,
	HttpStatus,
	Post,
	Body,
} from '@nestjs/common';
import { RecurrentTransactionUseCase } from 'src/models/recurrent-transaction';
import { RecurrentTransactionService } from 'src/usecases/recurrent-transaction/recurrent-transaction.service';
import { UserData } from './decorators/user-data';
import { UserDataDto } from './dtos';
import { CreateSalaryDto } from './dtos/recurrent-transaction';

@Controller('transactions')
export class RecurrentTransactionController {
	constructor(
		@Inject(RecurrentTransactionService)
		private readonly recurrentTransactionService: RecurrentTransactionUseCase,
	) {}

	@HttpCode(HttpStatus.CREATED)
	@Post('/salary')
	async createSalary(
		@UserData()
		userData: UserDataDto,
		@Body()
		body: CreateSalaryDto,
	) {
		return this.recurrentTransactionService.createSalary({
			...body,
			accountId: userData.accountId,
		});
	}
}

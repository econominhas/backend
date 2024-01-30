import { Controller, Inject } from '@nestjs/common';
import { RecurrentTransactionUseCase } from 'models/recurrent-transaction';
import { RecurrentTransactionService } from 'usecases/recurrent-transaction/recurrent-transaction.service';

@Controller('transactions')
export class RecurrentTransactionController {
	constructor(
		@Inject(RecurrentTransactionService)
		private readonly recurrentTransactionService: RecurrentTransactionUseCase,
	) {}
}

import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';
import { PaginatedDto } from './dtos';
import { BankService } from 'src/usecases/bank/bank.service';

@Controller('banks')
@UseGuards(AuthGuard())
export class BankController {
	constructor(private readonly bankService: BankService) {}

	@Get('/providers')
	async getDefault(
		@Query()
		pagination: PaginatedDto,
	) {
		return this.bankService.getProviders(pagination);
	}
}

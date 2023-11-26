import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';
import { PaginatedDto } from './dtos';
import { CardService } from 'src/usecases/card/card.service';

@Controller('cards')
@UseGuards(AuthGuard())
export class CardController {
	constructor(private readonly cardService: CardService) {}

	@Get('/providers')
	getDefault(
		@Query()
		pagination: PaginatedDto,
	) {
		return this.cardService.getProviders(pagination);
	}
}

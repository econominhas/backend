import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';
import { PaginatedDto, UserDataDto } from './dtos';
import { CardService } from 'src/usecases/card/card.service';
import { UserData } from './decorators/user-data';
import { CreateDto } from './dtos/card';

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

	@Post('/')
	create(
		@UserData()
		userData: UserDataDto,
		@Body()
		body: CreateDto,
	) {
		return this.cardService.create({
			...body,
			accountId: userData.accountId,
		});
	}
}

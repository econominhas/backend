import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { PaginatedDto, UserDataDto } from './dtos';
import { CardService } from 'usecases/card/card.service';
import { UserData } from './decorators/user-data';
import { CreateDto, GetBillsToBePaidDto, GetPostpaidDto } from './dtos/card';
import { CardUseCase } from 'models/card';

@Controller('cards')
export class CardController {
	constructor(
		@Inject(CardService)
		private readonly cardService: CardUseCase,
	) {}

	@Get('/providers')
	getProviders(
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

	@Get('/postpaid')
	getPostpaid(
		@UserData()
		userData: UserDataDto,
		@Query()
		query: GetPostpaidDto,
	) {
		return this.cardService.getPostpaid({
			...query,
			accountId: userData.accountId,
		});
	}

	@Get('/prepaid')
	getPrepaid(
		@UserData()
		userData: UserDataDto,
		@Query()
		pagination: PaginatedDto,
	) {
		return this.cardService.getPrepaid({
			...pagination,
			accountId: userData.accountId,
		});
	}

	@Get('/bills')
	getBillsToBePaid(
		@UserData()
		userData: UserDataDto,
		@Query()
		query: GetBillsToBePaidDto,
	) {
		return this.cardService.getBillsToBePaid({
			...query,
			accountId: userData.accountId,
		});
	}
}

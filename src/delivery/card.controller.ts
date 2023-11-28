import { Body, Controller, Get, Inject, Post, Query } from "@nestjs/common";
import { CardUseCase } from "src/models/card";
import { CardService } from "src/usecases/card/card.service";

import { UserData } from "./decorators/user-data";
import { PaginatedDto, UserDataDto } from "./dtos";
import { CreateDto } from "./dtos/card";

@Controller("cards")
export class CardController {
	constructor(
		@Inject(CardService)
		private readonly cardService: CardUseCase,
	) {}

	@Get("/providers")
	getDefault(
		@Query()
		pagination: PaginatedDto,
	) {
		return this.cardService.getProviders(pagination);
	}

	@Post("/")
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

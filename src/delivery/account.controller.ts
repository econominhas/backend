import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Inject,
	Patch,
} from "@nestjs/common";

import { AccountService } from "usecases/account/account.service";
import { AccountUseCase } from "models/account";

import { IgnoreTermsCheck } from "./guards/auth.guard";
import { UserData } from "./decorators/user-data";
import { NameDto, UpdateOnboardingDto } from "./dtos/account";
import { UserDataDto } from "./dtos";

@Controller("accounts")
export class AccountController {
	constructor(
		@Inject(AccountService)
		private readonly accountService: AccountUseCase,
	) {}

	@Get("/iam")
	@IgnoreTermsCheck()
	iam(
		@UserData()
		userData: UserDataDto,
	) {
		return this.accountService.iam({
			accountId: userData.accountId,
		});
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Patch("/name")
	name(
		@UserData()
		userData: UserDataDto,
		@Body()
		body: NameDto,
	) {
		return this.accountService.updateName({
			accountId: userData.accountId,
			name: body.name,
		});
	}

	@Get("/onboarding")
	getOnboarding(
		@UserData()
		userData: UserDataDto,
	) {
		return this.accountService.getOnboarding({
			accountId: userData.accountId,
		});
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Patch("/onboarding")
	updateOnboarding(
		@UserData()
		userData: UserDataDto,
		@Body()
		body: UpdateOnboardingDto,
	) {
		return this.accountService.updateOnboarding({
			...body,
			accountId: userData.accountId,
		});
	}
}

import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Inject,
	Patch,
} from "@nestjs/common";
import { AccountUseCase } from "src/models/account";
import { AccountService } from "src/usecases/account/account.service";

import { UserData } from "./decorators/user-data";
import { UserDataDto } from "./dtos";
import { NameDto } from "./dtos/account";
import { IgnoreTermsCheck } from "./guards/auth.guard";

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
}

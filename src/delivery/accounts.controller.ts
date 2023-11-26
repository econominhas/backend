import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Patch,
	UseGuards,
} from '@nestjs/common';
import { AccountService } from 'src/usecases/account/account.service';
import { AuthGuard } from './guards/auth.guard';
import { UserData } from './decorators/user-data';
import { NameDto } from './dtos/account';
import { UserDataDto } from './dtos';

@Controller('accounts')
export class AccountsController {
	constructor(private readonly accountService: AccountService) {}

	@Get('/iam')
	@UseGuards(AuthGuard({ ignoreTermsCheck: true }))
	iam(
		@UserData()
		userData: UserDataDto,
	) {
		return this.accountService.iam({
			accountId: userData.accountId,
		});
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Patch('/name')
	@UseGuards(AuthGuard())
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

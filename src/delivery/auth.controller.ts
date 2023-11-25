import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Res,
	UseGuards,
} from '@nestjs/common';
import { AccountService } from 'src/usecases/account/account.service';
import { AuthGuard } from './guards/auth.guard';
import { UserData } from './decorators/user-data';
import { Response } from 'express';
import {
	CreateFromEmailProviderDto,
	CreateFromGoogleProviderDto,
	CreateFromPhoneProviderDto,
	ExchangeCodeDto,
	RefreshTokenDto,
} from './dtos/auth';
import { UserDataDto } from './dtos';

@Controller('')
export class AuthController {
	constructor(private readonly accountService: AccountService) {}

	@Post('/auth/google')
	async createFromGoogleProvider(
		@Body()
		body: CreateFromGoogleProviderDto,
		@Res()
		res: Response,
	) {
		const { isFirstAccess, ...data } =
			await this.accountService.createFromGoogleProvider(body);

		if (isFirstAccess) {
			res.status(HttpStatus.CREATED);
		} else {
			res.status(HttpStatus.OK);
		}

		return data;
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Post('/auth/email')
	createFromEmailProvider(
		@Body()
		body: CreateFromEmailProviderDto,
	) {
		return this.accountService.createFromEmailProvider(body);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Post('/auth/phone')
	createFromPhoneProvider(
		@Body()
		body: CreateFromPhoneProviderDto,
	) {
		return this.accountService.createFromPhoneProvider(body);
	}

	@Post('/auth/code')
	async exchangeCode(
		@Body()
		body: ExchangeCodeDto,
		@Res()
		res: Response,
	) {
		const { isFirstAccess, ...data } =
			await this.accountService.exchangeCode(body);

		if (isFirstAccess) {
			res.status(HttpStatus.CREATED);
		} else {
			res.status(HttpStatus.OK);
		}

		return data;
	}

	@Post('/auth/refresh')
	refreshToken(
		@Body()
		body: RefreshTokenDto,
	) {
		return this.accountService.refreshToken(body);
	}

	@Get('/accounts/iam')
	@UseGuards(AuthGuard)
	iam(
		@UserData()
		userData: UserDataDto,
	) {
		return this.accountService.iam({
			id: userData.accountId,
		});
	}
}

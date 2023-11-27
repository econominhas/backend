import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Res,
} from '@nestjs/common';
import { Response } from 'express';
import {
	CreateFromEmailProviderDto,
	CreateFromGoogleProviderDto,
	CreateFromPhoneProviderDto,
	ExchangeCodeDto,
	RefreshTokenDto,
} from './dtos/auth';
import { AuthService } from 'src/usecases/auth/auth.service';

@Controller('')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('/auth/google')
	async createFromGoogleProvider(
		@Body()
		body: CreateFromGoogleProviderDto,
		@Res()
		res: Response,
	) {
		const { isFirstAccess, ...data } =
			await this.authService.createFromGoogleProvider(body);

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
		return this.authService.createFromEmailProvider(body);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Post('/auth/phone')
	createFromPhoneProvider(
		@Body()
		body: CreateFromPhoneProviderDto,
	) {
		return this.authService.createFromPhoneProvider(body);
	}

	@Post('/auth/code')
	async exchangeCode(
		@Body()
		body: ExchangeCodeDto,
		@Res()
		res: Response,
	) {
		const { isFirstAccess, ...data } =
			await this.authService.exchangeCode(body);

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
		return this.authService.refreshToken(body);
	}
}

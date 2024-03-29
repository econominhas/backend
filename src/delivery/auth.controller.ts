import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Inject,
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
import { AuthService } from 'usecases/auth/auth.service';
import { Public } from './guards/auth.guard';
import { AuthUseCase } from 'models/auth';

@Controller('auth')
export class AuthController {
	constructor(
		@Inject(AuthService)
		private readonly authService: AuthUseCase,
	) {}

	@Post('/google')
	@Public()
	async createFromGoogleProvider(
		@Body()
		body: CreateFromGoogleProviderDto,
		@Res({ passthrough: true })
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
	@Post('/email')
	@Public()
	createFromEmailProvider(
		@Body()
		body: CreateFromEmailProviderDto,
	) {
		return this.authService.createFromEmailProvider(body);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Post('/phone')
	@Public()
	createFromPhoneProvider(
		@Body()
		body: CreateFromPhoneProviderDto,
	) {
		return this.authService.createFromPhoneProvider(body);
	}

	@Post('/code')
	@Public()
	async exchangeCode(
		@Body()
		body: ExchangeCodeDto,
		@Res({ passthrough: true })
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

	@Post('/refresh')
	@Public()
	refreshToken(
		@Body()
		body: RefreshTokenDto,
	) {
		return this.authService.refreshToken(body);
	}
}

import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Inject,
	Post,
} from '@nestjs/common';
import {
	CreateFromEmailProviderDto,
	SignWith3rdPartyProviderDto,
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

	@HttpCode(HttpStatus.OK)
	@Post('/google/sign-in')
	@Public()
	async signInWithGoogleProvider(
		@Body()
		body: SignWith3rdPartyProviderDto,
	) {
		return this.authService.signInWithGoogleProvider(body);
	}

	@HttpCode(HttpStatus.CREATED)
	@Post('/google/sign-up')
	@Public()
	async signUpWithGoogleProvider(
		@Body()
		body: SignWith3rdPartyProviderDto,
	) {
		return this.authService.signUpWithGoogleProvider(body);
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

	@HttpCode(HttpStatus.OK)
	@Post('/code')
	@Public()
	async exchangeCode(
		@Body()
		body: ExchangeCodeDto,
	) {
		return this.authService.exchangeCode(body);
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

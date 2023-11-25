import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';
import { UserData } from './decorators/user-data';
import { TermsAndPoliciesService } from 'src/usecases/terms-and-policies/terms-and-policies.service';
import { AcceptDto } from './dtos/terms-and-policies';
import { UserDataDto } from './dtos';

@Controller('terms')
export class TermsAndPoliciesController {
	constructor(
		private readonly termsAndPoliciesService: TermsAndPoliciesService,
	) {}

	@HttpCode(HttpStatus.CREATED)
	@Post('/accept')
	@UseGuards(AuthGuard({ ignoreTermsCheck: true }))
	async accept(
		@UserData()
		userData: UserDataDto,
		@Body()
		body: AcceptDto,
	) {
		return this.termsAndPoliciesService.accept({
			accountId: userData.accountId,
			semVer: body.semVer,
		});
	}

	@Get('/latest')
	latest() {
		return this.termsAndPoliciesService.getLatest();
	}
}

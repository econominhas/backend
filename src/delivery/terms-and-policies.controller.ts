import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
} from '@nestjs/common';
import { IgnoreTermsCheck, Public } from './guards/auth.guard';
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
	@IgnoreTermsCheck()
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
	@Public()
	latest() {
		return this.termsAndPoliciesService.getLatest();
	}
}

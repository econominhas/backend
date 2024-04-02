import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Inject,
	Post,
} from "@nestjs/common";

import { TermsAndPoliciesService } from "usecases/terms-and-policies/terms-and-policies.service";
import { TermsAndPoliciesUseCase } from "models/terms-and-policies";

import { IgnoreTermsCheck, Public } from "./guards/auth.guard";
import { UserData } from "./decorators/user-data";
import { AcceptDto } from "./dtos/terms-and-policies";
import { UserDataDto } from "./dtos";

@Controller("terms")
export class TermsAndPoliciesController {
	constructor(
		@Inject(TermsAndPoliciesService)
		private readonly termsAndPoliciesService: TermsAndPoliciesUseCase,
	) {}

	@HttpCode(HttpStatus.CREATED)
	@Post("/accept")
	@IgnoreTermsCheck()
	accept(
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

	@Get("/latest")
	@Public()
	latest() {
		return this.termsAndPoliciesService.getLatest();
	}
}

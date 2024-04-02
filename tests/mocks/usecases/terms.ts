import { TermsAndPoliciesService } from "../../../src/usecases/terms-and-policies/terms-and-policies.service";
import { type TermsAndPoliciesUseCase } from "../../../src/models/terms-and-policies";
import { type Mock } from "../types";

export const makeTermsServiceMock = () => {
	const mock: Mock<TermsAndPoliciesUseCase> = {
		accept: jest.fn(),
		hasAcceptedLatest: jest.fn(),
		getLatest: jest.fn(),
	};

	const module = {
		provide: TermsAndPoliciesService,
		useValue: mock,
	};

	return {
		mock,
		module,
	};
};

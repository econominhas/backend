import { AccountService } from "../../../src/usecases/account/account.service";
import { type Mock } from "../types";
import { type AccountUseCase } from "../../../src/models/account";

export const makeAccountServiceMock = () => {
	const mock: Mock<AccountUseCase> = {
		getOnboarding: jest.fn(),
		iam: jest.fn(),
		setBudget: jest.fn(),
		updateName: jest.fn(),
		updateOnboarding: jest.fn(),
	};

	const outputs = {
		setBudget: {
			sucess: undefined,
		},
	};
	const module = {
		provide: AccountService,
		useValue: mock,
	};

	return {
		mock,
		outputs,
		module,
	};
};

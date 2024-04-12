import { type Account } from "@prisma/client";

import { AccountRepositoryService } from "../../../../src/repositories/postgres/account/account-repository.service";
import { type AccountRepository } from "../../../../src/models/account";
import { type Mock } from "../../types";

export const makeAccountRepositoryMock = () => {
	const base: Account = {
		id: "accountId",
		email: "foo@bar",
		phone: null,
		createdAt: new Date(),
	};

	const mock: Mock<AccountRepository> = {
		getById: jest.fn(),
		getByIdWithProviders: jest.fn(),
		updateConfig: jest.fn(),
	};

	const module = {
		provide: AccountRepositoryService,
		useValue: mock,
	};

	return {
		base,
		mock,
		module,
	};
};

import { type MagicLinkCode } from "@prisma/client";

import { MagicLinkCodeRepositoryService } from "../../../../src/repositories/postgres/magic-link-code/magic-link-code-repository.service";
import { type MagicLinkCodeRepository } from "../../../../src/models/magic-link-code";
import { type Mock } from "../../types";

export const makeMagicLinkCodeRepositoryMock = () => {
	const base: MagicLinkCode = {
		accountId: "accountId",
		code: "code",
		isFirstAccess: false,
		createdAt: new Date(),
	};

	const mock: Mock<MagicLinkCodeRepository> = {
		upsert: jest.fn(),
		get: jest.fn(),
	};

	const module = {
		provide: MagicLinkCodeRepositoryService,
		useValue: mock,
	};

	const outputs = {
		get: {
			success: {
				accountId: "accountId",
				code: "code",
				isFirstAccess: false,
				createdAt: new Date(),
			},
			firstAccess: {
				accountId: "accountId",
				code: "code",
				isFirstAccess: true,
				createdAt: new Date(),
			},
		},
	};

	return {
		base,
		mock,
		module,
		outputs,
	};
};

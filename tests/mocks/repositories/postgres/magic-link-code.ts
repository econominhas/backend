import type { MagicLinkCode } from '@prisma/client';
import type { Mock } from '../../types';
import type { MagicLinkCodeRepository } from 'models/magic-link-code';
import { MagicLinkCodeRepositoryService } from 'repositories/postgres/magic-link-code/magic-link-code-repository.service';

export const makeMagicLinkCodeRepositoryMock = () => {
	const base: MagicLinkCode = {
		accountId: 'accountId',
		code: 'code',
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
				accountId: 'accountId',
				code: 'code',
				isFirstAccess: false,
				createdAt: new Date(),
			},
			firstAccess: {
				accountId: 'accountId',
				code: 'code',
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

import { JWTAdapterService } from 'adapters/implementations/jwt/token.service';
import type { TokenAdapter } from 'adapters/token';
import type { Mock } from '../types';

export const makeTokenAdapterMock = () => {
	const mock: Mock<TokenAdapter> = {
		genAccess: jest.fn(),
		validateAccess: jest.fn(),
		genRefresh: jest.fn(),
	};

	const module = {
		provide: JWTAdapterService,
		useValue: mock,
	};

	const outputs = {
		genAccess: {
			success: {
				accessToken: 'accessToken',
				expiresAt: new Date().toISOString(),
			},
		},
	};

	return {
		mock,
		module,
		outputs,
	};
};

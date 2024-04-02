import type { GoogleAdapter } from '../../../src/adapters/google';
import { GoogleAdapterService } from '../../../src/adapters/implementations/google/google.service';
import type { Mock } from '../types';

export const makeGoogleAdapterMock = () => {
	const mock: Mock<Omit<GoogleAdapter, 'requiredScopes'>> & {
		requiredScopes: Array<string>;
	} = {
		requiredScopes: ['email', 'openid', 'email'],
		exchangeCode: jest.fn(),
		getAuthenticatedUserData: jest.fn(),
	};

	const module = {
		provide: GoogleAdapterService,
		useValue: mock,
	};

	const outputs = {
		exchangeCode: {
			success: {
				scopes: mock.requiredScopes,
				accessToken: 'accessToken',
				refreshToken: 'refreshToken',
				expiresAt: new Date(),
			},
			noScopes: {
				scopes: [],
				accessToken: 'accessToken',
				refreshToken: 'refreshToken',
				expiresAt: new Date(),
			},
		},
		getAuthenticatedUserData: {
			success: {
				id: 'providerId',
				name: 'Foo Bar',
				email: 'foo@bar.com',
				isEmailVerified: true,
			},
			unverified: {
				id: 'providerId',
				name: 'Foo Bar',
				email: 'foo@bar.com',
				isEmailVerified: false,
			},
		},
	};

	return {
		mock,
		module,
		outputs,
	};
};

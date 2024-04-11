import { FacebookAdapterService } from "../../../src/adapters/implementations/facebook/facebook.service";
import { type Mock } from "../types";
import { type AuthProviderAdapter } from "../../../src/adapters/auth-provider";

export const makeFacebookAdapterMock = () => {
	const mock: Mock<Omit<AuthProviderAdapter, "requiredScopes">> & {
		requiredScopes: Array<string>;
	} = {
		requiredScopes: ["email", "profile"],
		exchangeCode: jest.fn(),
		getAuthenticatedUserData: jest.fn(),
	};

	const module = {
		provide: FacebookAdapterService,
		useValue: mock,
	};

	const outputs = {
		exchangeCode: {
			success: {
				scopes: mock.requiredScopes,
				accessToken: "accessToken",
				refreshToken: "refreshToken",
				expiresAt: new Date(),
			},
			noScopes: {
				scopes: [],
				accessToken: "accessToken",
				refreshToken: "refreshToken",
				expiresAt: new Date(),
			},
		},
		getAuthenticatedUserData: {
			success: {
				id: "providerId",
				name: "Foo Bar",
				email: "foo@bar.com",
				isEmailVerified: true,
			},
			unverified: {
				id: "providerId",
				name: "Foo Bar",
				email: "foo@bar.com",
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

import { SignInProviderEnum } from "@prisma/client";

import { AuthRepositoryService } from "../../../../src/repositories/postgres/auth/auth-repository.service";
import { type AuthRepository } from "../../../../src/models/auth";
import { type Mock } from "../../types";

export const makeAuthRepositoryMock = () => {
	const mock: Mock<AuthRepository> = {
		create: jest.fn(),
		getByEmail: jest.fn(),
		getByPhone: jest.fn(),
		getByProvider: jest.fn(),
		getManyByProvider: jest.fn(),
		updateProvider: jest.fn(),
	};

	const module = {
		provide: AuthRepositoryService,
		useValue: mock,
	};

	const outputs = {
		getManyByProvider: {
			empty: [],
			email: [
				{
					id: "accountId",
					email: "foo@bar.com",
					createdAt: new Date(),
					signInProviders: [],
				},
			],
			google: [
				{
					id: "accountId",
					email: "foo@bar.com",
					createdAt: new Date(),
					signInProviders: [
						{
							accountId: "accountId",
							provider: SignInProviderEnum.GOOGLE,
							providerId: "providerId",
							accessToken: "accessToken",
							refreshToken: "refreshToken",
							expiresAt: new Date(),
						},
					],
				},
			],
			sameEmailDifferentGoogle: [
				{
					id: "accountId",
					email: "foo@bar.com",
					createdAt: new Date(),
					signInProviders: [
						{
							accountId: "accountId",
							provider: SignInProviderEnum.GOOGLE,
							providerId: "differentProviderId",
							accessToken: "accessToken",
							refreshToken: "refreshToken",
							expiresAt: new Date(),
						},
					],
				},
			],
		},
		create: {
			successGoogle: {
				id: "accountId",
				email: "foo@bar.com",
				createdAt: new Date(),
			},
		},
	};

	return {
		mock,
		module,
		outputs,
	};
};

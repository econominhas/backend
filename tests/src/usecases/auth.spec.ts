import type { INestApplication } from '@nestjs/common';
import { createTestModule, createTestService } from '../../utils';
import { AuthService } from 'usecases/auth/auth.service';
import { AuthModule } from 'usecases/auth/auth.module';
import { makeMagicLinkCodeRepositoryMock } from '../../mocks/repositories/postgres/magic-link-code';
import { makeRefreshTokenRepositoryMock } from '../../mocks/repositories/postgres/refresh-token';
import { makeTermsServiceMock } from '../../mocks/usecases/terms';
import { makeGoogleAdapterMock } from '../../mocks/adapters/google';
import { makeTokenAdapterMock } from '../../mocks/adapters/token';
import { makeEmailAdapterMock } from '../../mocks/adapters/email';
import { makeSmsAdapterMock } from '../../mocks/adapters/sms';
import { makeAuthRepositoryMock } from '../../mocks/repositories/postgres/auth';

describe('Usecases > Auth', () => {
	let service: AuthService;
	let module: INestApplication;

	const authRepository = makeAuthRepositoryMock();
	const magicLinkCodeRepository = makeMagicLinkCodeRepositoryMock();
	const refreshTokenRepository = makeRefreshTokenRepositoryMock();

	const termsService = makeTermsServiceMock();

	const googleAdapter = makeGoogleAdapterMock();
	const tokenAdapter = makeTokenAdapterMock();
	const emailAdapter = makeEmailAdapterMock();
	const smsAdapter = makeSmsAdapterMock();

	beforeAll(async () => {
		try {
			service = await createTestService<AuthService>(AuthService, {
				providers: [
					authRepository.module,
					magicLinkCodeRepository.module,
					refreshTokenRepository.module,
					termsService.module,
					googleAdapter.module,
					tokenAdapter.module,
					emailAdapter.module,
					smsAdapter.module,
				],
			});

			module = await createTestModule(AuthModule);
		} catch (err) {
			console.error(err);
		}
	});

	describe('definitions', () => {
		it('should initialize Service', () => {
			expect(service).toBeDefined();
		});

		it('should initialize Module', async () => {
			expect(module).toBeDefined();
		});
	});

	describe('> signInWithGoogleProvider', () => {
		it('should sign in user (same providerId)', async () => {
			googleAdapter.mock.exchangeCode.mockResolvedValue(
				googleAdapter.outputs.exchangeCode.success,
			);
			googleAdapter.mock.getAuthenticatedUserData.mockResolvedValue(
				googleAdapter.outputs.getAuthenticatedUserData.success,
			);
			authRepository.mock.getManyByProvider.mockResolvedValue(
				authRepository.outputs.getManyByProvider.google,
			);
			authRepository.mock.updateProvider.mockResolvedValue(undefined);
			refreshTokenRepository.mock.create.mockResolvedValue(
				refreshTokenRepository.outputs.create.success,
			);
			termsService.mock.hasAcceptedLatest.mockResolvedValue(true);
			tokenAdapter.mock.genAccess.mockReturnValue(
				tokenAdapter.outputs.genAccess.success,
			);

			let result;
			try {
				result = await service.signInWithGoogleProvider({
					code: 'code',
				});
			} catch (err) {
				result = err;
			}

			expect(result).toMatchObject({
				accessToken: tokenAdapter.outputs.genAccess.success.accessToken,
				expiresAt: tokenAdapter.outputs.genAccess.success.expiresAt,
				refreshToken:
					refreshTokenRepository.outputs.create.success.refreshToken,
			});
			expect(googleAdapter.mock.exchangeCode).toHaveBeenCalled();
			expect(googleAdapter.mock.getAuthenticatedUserData).toHaveBeenCalled();
			expect(authRepository.mock.getManyByProvider).toHaveBeenCalled();
			expect(authRepository.mock.updateProvider).toHaveBeenCalled();
			expect(refreshTokenRepository.mock.create).toHaveBeenCalled();
			expect(termsService.mock.hasAcceptedLatest).toHaveBeenCalled();
			expect(tokenAdapter.mock.genAccess).toHaveBeenCalled();
		});

		it('should sign in user (same email)', async () => {
			googleAdapter.mock.exchangeCode.mockResolvedValue(
				googleAdapter.outputs.exchangeCode.success,
			);
			googleAdapter.mock.getAuthenticatedUserData.mockResolvedValue(
				googleAdapter.outputs.getAuthenticatedUserData.success,
			);
			authRepository.mock.getManyByProvider.mockResolvedValue(
				authRepository.outputs.getManyByProvider.email,
			);
			authRepository.mock.updateProvider.mockResolvedValue(undefined);
			refreshTokenRepository.mock.create.mockResolvedValue(
				refreshTokenRepository.outputs.create.success,
			);
			termsService.mock.hasAcceptedLatest.mockResolvedValue(true);
			tokenAdapter.mock.genAccess.mockReturnValue(
				tokenAdapter.outputs.genAccess.success,
			);

			let result;
			try {
				result = await service.signInWithGoogleProvider({
					code: 'code',
				});
			} catch (err) {
				result = err;
			}

			expect(result).toMatchObject({
				accessToken: tokenAdapter.outputs.genAccess.success.accessToken,
				expiresAt: tokenAdapter.outputs.genAccess.success.expiresAt,
				refreshToken:
					refreshTokenRepository.outputs.create.success.refreshToken,
			});
			expect(googleAdapter.mock.exchangeCode).toHaveBeenCalled();
			expect(googleAdapter.mock.getAuthenticatedUserData).toHaveBeenCalled();
			expect(authRepository.mock.getManyByProvider).toHaveBeenCalled();
			expect(authRepository.mock.updateProvider).toHaveBeenCalled();
			expect(refreshTokenRepository.mock.create).toHaveBeenCalled();
			expect(termsService.mock.hasAcceptedLatest).toHaveBeenCalled();
			expect(tokenAdapter.mock.genAccess).toHaveBeenCalled();
		});

		it("should fail if user doesn't exists", async () => {
			googleAdapter.mock.exchangeCode.mockResolvedValue(
				googleAdapter.outputs.exchangeCode.success,
			);
			googleAdapter.mock.getAuthenticatedUserData.mockResolvedValue(
				googleAdapter.outputs.getAuthenticatedUserData.success,
			);
			authRepository.mock.getManyByProvider.mockResolvedValue(
				authRepository.outputs.getManyByProvider.empty,
			);

			let result;
			try {
				result = await service.signInWithGoogleProvider({
					code: 'code',
				});
			} catch (err) {
				result = err;
			}

			expect(result).toBeInstanceOf(Error);
			expect(result.status).toBe(404);
			expect(result.message).toBe('User not found');
			expect(googleAdapter.mock.exchangeCode).toHaveBeenCalled();
			expect(googleAdapter.mock.getAuthenticatedUserData).toHaveBeenCalled();
			expect(authRepository.mock.getManyByProvider).toHaveBeenCalled();
			expect(authRepository.mock.updateProvider).not.toHaveBeenCalled();
			expect(refreshTokenRepository.mock.create).not.toHaveBeenCalled();
			expect(termsService.mock.hasAcceptedLatest).not.toHaveBeenCalled();
			expect(tokenAdapter.mock.genAccess).not.toHaveBeenCalled();
		});

		it('should fail if missing scopes', async () => {
			googleAdapter.mock.exchangeCode.mockResolvedValue(
				googleAdapter.outputs.exchangeCode.noScopes,
			);

			let result;
			try {
				result = await service.signInWithGoogleProvider({
					code: 'code',
				});
			} catch (err) {
				result = err;
			}

			expect(result).toBeInstanceOf(Error);
			expect(result.status).toBe(400);
			expect(result.message).toBe(
				`Missing required scopes: ${googleAdapter.mock.requiredScopes.join(
					' ',
				)}`,
			);
			expect(googleAdapter.mock.exchangeCode).toHaveBeenCalled();
			expect(
				googleAdapter.mock.getAuthenticatedUserData,
			).not.toHaveBeenCalled();
		});

		it('should fail if unverified provider email', async () => {
			googleAdapter.mock.exchangeCode.mockResolvedValue(
				googleAdapter.outputs.exchangeCode.success,
			);
			googleAdapter.mock.getAuthenticatedUserData.mockResolvedValue(
				googleAdapter.outputs.getAuthenticatedUserData.unverified,
			);

			let result;
			try {
				result = await service.signInWithGoogleProvider({
					code: 'code',
				});
			} catch (err) {
				result = err;
			}

			expect(result).toBeInstanceOf(Error);
			expect(result.status).toBe(403);
			expect(result.message).toBe('Unverified provider email');
			expect(googleAdapter.mock.exchangeCode).toHaveBeenCalled();
			expect(googleAdapter.mock.getAuthenticatedUserData).toHaveBeenCalled();
			expect(authRepository.mock.getManyByProvider).not.toHaveBeenCalled();
		});

		it('should fail if find account by email related to another google account', async () => {
			googleAdapter.mock.exchangeCode.mockResolvedValue(
				googleAdapter.outputs.exchangeCode.success,
			);
			googleAdapter.mock.getAuthenticatedUserData.mockResolvedValue(
				googleAdapter.outputs.getAuthenticatedUserData.success,
			);
			authRepository.mock.getManyByProvider.mockResolvedValue(
				authRepository.outputs.getManyByProvider.sameEmailDifferentGoogle,
			);

			let result;
			try {
				result = await service.signInWithGoogleProvider({
					code: 'code',
				});
			} catch (err) {
				result = err;
			}

			expect(result).toBeInstanceOf(Error);
			expect(result.status).toBe(409);
			expect(result.message).toBe(
				'Error finding account, please contact support',
			);
			expect(googleAdapter.mock.exchangeCode).toHaveBeenCalled();
			expect(googleAdapter.mock.getAuthenticatedUserData).toHaveBeenCalled();
			expect(authRepository.mock.getManyByProvider).toHaveBeenCalled();
			expect(authRepository.mock.updateProvider).not.toHaveBeenCalled();
		});
	});

	describe('> signUpWithGoogleProvider', () => {
		it('should sign up user', async () => {
			googleAdapter.mock.exchangeCode.mockResolvedValue(
				googleAdapter.outputs.exchangeCode.success,
			);
			googleAdapter.mock.getAuthenticatedUserData.mockResolvedValue(
				googleAdapter.outputs.getAuthenticatedUserData.success,
			);
			authRepository.mock.getManyByProvider.mockResolvedValue(
				authRepository.outputs.getManyByProvider.empty,
			);
			authRepository.mock.create.mockResolvedValue(
				authRepository.outputs.create.successGoogle,
			);
			refreshTokenRepository.mock.create.mockResolvedValue(
				refreshTokenRepository.outputs.create.success,
			);
			tokenAdapter.mock.genAccess.mockReturnValue(
				tokenAdapter.outputs.genAccess.success,
			);

			let result;
			try {
				result = await service.signUpWithGoogleProvider({
					code: 'code',
				});
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual({
				accessToken: tokenAdapter.outputs.genAccess.success.accessToken,
				expiresAt: tokenAdapter.outputs.genAccess.success.expiresAt,
				refreshToken:
					refreshTokenRepository.outputs.create.success.refreshToken,
			});
			expect(googleAdapter.mock.exchangeCode).toHaveBeenCalled();
			expect(googleAdapter.mock.getAuthenticatedUserData).toHaveBeenCalled();
			expect(authRepository.mock.getManyByProvider).toHaveBeenCalled();
			expect(authRepository.mock.create).toHaveBeenCalled();
			expect(refreshTokenRepository.mock.create).toHaveBeenCalled();
			expect(tokenAdapter.mock.genAccess).toHaveBeenCalled();
		});

		it('should fail if user already exists (same providerId)', async () => {
			googleAdapter.mock.exchangeCode.mockResolvedValue(
				googleAdapter.outputs.exchangeCode.success,
			);
			googleAdapter.mock.getAuthenticatedUserData.mockResolvedValue(
				googleAdapter.outputs.getAuthenticatedUserData.success,
			);
			authRepository.mock.getManyByProvider.mockResolvedValue(
				authRepository.outputs.getManyByProvider.google,
			);
			authRepository.mock.updateProvider.mockResolvedValue(undefined);
			refreshTokenRepository.mock.create.mockResolvedValue(
				refreshTokenRepository.outputs.create.success,
			);
			termsService.mock.hasAcceptedLatest.mockResolvedValue(true);
			tokenAdapter.mock.genAccess.mockReturnValue(
				tokenAdapter.outputs.genAccess.success,
			);

			let result;
			try {
				result = await service.signUpWithGoogleProvider({
					code: 'code',
				});
			} catch (err) {
				result = err;
			}

			expect(result).toBeInstanceOf(Error);
			expect(result.status).toBe(409);
			expect(result.message).toBe('User already exists');
			expect(googleAdapter.mock.exchangeCode).toHaveBeenCalled();
			expect(googleAdapter.mock.getAuthenticatedUserData).toHaveBeenCalled();
			expect(authRepository.mock.getManyByProvider).toHaveBeenCalled();
			expect(authRepository.mock.updateProvider).not.toHaveBeenCalled();
			expect(refreshTokenRepository.mock.create).not.toHaveBeenCalled();
			expect(termsService.mock.hasAcceptedLatest).not.toHaveBeenCalled();
			expect(tokenAdapter.mock.genAccess).not.toHaveBeenCalled();
		});

		it('should fail if user already exists (same email)', async () => {
			googleAdapter.mock.exchangeCode.mockResolvedValue(
				googleAdapter.outputs.exchangeCode.success,
			);
			googleAdapter.mock.getAuthenticatedUserData.mockResolvedValue(
				googleAdapter.outputs.getAuthenticatedUserData.success,
			);
			authRepository.mock.getManyByProvider.mockResolvedValue(
				authRepository.outputs.getManyByProvider.email,
			);
			authRepository.mock.updateProvider.mockResolvedValue(undefined);
			refreshTokenRepository.mock.create.mockResolvedValue(
				refreshTokenRepository.outputs.create.success,
			);
			termsService.mock.hasAcceptedLatest.mockResolvedValue(true);
			tokenAdapter.mock.genAccess.mockReturnValue(
				tokenAdapter.outputs.genAccess.success,
			);

			let result;
			try {
				result = await service.signUpWithGoogleProvider({
					code: 'code',
				});
			} catch (err) {
				result = err;
			}

			expect(result).toBeInstanceOf(Error);
			expect(result.status).toBe(409);
			expect(result.message).toBe('User already exists');
			expect(googleAdapter.mock.exchangeCode).toHaveBeenCalled();
			expect(googleAdapter.mock.getAuthenticatedUserData).toHaveBeenCalled();
			expect(authRepository.mock.getManyByProvider).toHaveBeenCalled();
			expect(authRepository.mock.updateProvider).not.toHaveBeenCalled();
			expect(refreshTokenRepository.mock.create).not.toHaveBeenCalled();
			expect(termsService.mock.hasAcceptedLatest).not.toHaveBeenCalled();
			expect(tokenAdapter.mock.genAccess).not.toHaveBeenCalled();
		});

		it('should fail if missing scopes', async () => {
			googleAdapter.mock.exchangeCode.mockResolvedValue(
				googleAdapter.outputs.exchangeCode.noScopes,
			);

			let result;
			try {
				result = await service.signUpWithGoogleProvider({
					code: 'code',
				});
			} catch (err) {
				result = err;
			}

			expect(result).toBeInstanceOf(Error);
			expect(result.status).toBe(400);
			expect(result.message).toBe(
				`Missing required scopes: ${googleAdapter.mock.requiredScopes.join(
					' ',
				)}`,
			);
			expect(googleAdapter.mock.exchangeCode).toHaveBeenCalled();
			expect(
				googleAdapter.mock.getAuthenticatedUserData,
			).not.toHaveBeenCalled();
		});

		it('should fail if unverified provider email', async () => {
			googleAdapter.mock.exchangeCode.mockResolvedValue(
				googleAdapter.outputs.exchangeCode.success,
			);
			googleAdapter.mock.getAuthenticatedUserData.mockResolvedValue(
				googleAdapter.outputs.getAuthenticatedUserData.unverified,
			);

			let result;
			try {
				result = await service.signUpWithGoogleProvider({
					code: 'code',
				});
			} catch (err) {
				result = err;
			}

			expect(result).toBeInstanceOf(Error);
			expect(result.status).toBe(403);
			expect(result.message).toBe('Unverified provider email');
			expect(googleAdapter.mock.exchangeCode).toHaveBeenCalled();
			expect(googleAdapter.mock.getAuthenticatedUserData).toHaveBeenCalled();
			expect(authRepository.mock.getManyByProvider).not.toHaveBeenCalled();
		});
	});

	describe('> createFromEmailProvider', () => {
		it.todo('should');
	});

	describe('> createFromPhoneProvider', () => {
		it.todo('should');
	});

	describe('> exchangeCode', () => {
		it('should return auth tokens', async () => {
			magicLinkCodeRepository.mock.get.mockResolvedValue(
				magicLinkCodeRepository.outputs.get.success,
			);
			refreshTokenRepository.mock.create.mockResolvedValue(
				refreshTokenRepository.outputs.create.success,
			);
			tokenAdapter.mock.genAccess.mockReturnValue(
				tokenAdapter.outputs.genAccess.success,
			);

			let result;
			try {
				result = await service.exchangeCode({
					accountId: 'accountId',
					code: 'code',
				});
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual({
				accessToken: tokenAdapter.outputs.genAccess.success.accessToken,
				expiresAt: tokenAdapter.outputs.genAccess.success.expiresAt,
				refreshToken:
					refreshTokenRepository.outputs.create.success.refreshToken,
			});
			expect(magicLinkCodeRepository.mock.get).toHaveBeenCalled();
			expect(refreshTokenRepository.mock.create).toHaveBeenCalled();
			expect(tokenAdapter.mock.genAccess).toHaveBeenCalled();
		});

		it('should throw error if magic link code not found', async () => {
			magicLinkCodeRepository.mock.get.mockResolvedValue(undefined);

			let result;
			try {
				result = await service.exchangeCode({
					accountId: 'accountId',
					code: 'code',
				});
			} catch (err) {
				result = err;
			}

			expect(result).toBeInstanceOf(Error);
			expect(result.status).toBe(404);
			expect(result.message).toBe('Invalid code');
			expect(magicLinkCodeRepository.mock.get).toHaveBeenCalled();
			expect(refreshTokenRepository.mock.create).not.toHaveBeenCalled();
			expect(tokenAdapter.mock.genAccess).not.toHaveBeenCalled();
		});
	});

	describe('> refreshToken', () => {
		it('should regen access token', async () => {
			const expiresAt = new Date();

			refreshTokenRepository.mock.get.mockResolvedValue(
				refreshTokenRepository.outputs.get.success,
			);
			termsService.mock.hasAcceptedLatest.mockResolvedValue(true);
			tokenAdapter.mock.genAccess.mockReturnValue({
				accessToken: 'accessToken',
				expiresAt,
			});

			let result;
			try {
				result = await service.refreshToken({
					refreshToken: 'refreshToken',
				});
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual({
				accessToken: 'accessToken',
				expiresAt,
				refreshToken: undefined,
			});
		});

		it('should throw error if refresh token not found', async () => {
			refreshTokenRepository.mock.get.mockResolvedValue(undefined);

			let result;
			try {
				result = await service.refreshToken({
					refreshToken: 'refreshToken',
				});
			} catch (err) {
				result = err;
			}

			expect(result).toBeInstanceOf(Error);
			expect(result.status).toBe(404);
			expect(result.message).toBe('Refresh token not found');
			expect(refreshTokenRepository.mock.get).toHaveBeenCalled();
			expect(tokenAdapter.mock.genAccess).not.toHaveBeenCalled();
		});
	});

	describe('> genAuthOutput', () => {
		it('should return access and refresh token', async () => {
			const expiresAt = new Date();

			refreshTokenRepository.mock.create.mockResolvedValue(
				refreshTokenRepository.outputs.create.success,
			);
			termsService.mock.hasAcceptedLatest.mockResolvedValue(true);
			tokenAdapter.mock.genAccess.mockReturnValue({
				accessToken: 'accessToken',
				expiresAt,
			});

			let result;
			try {
				result = await service.genAuthOutput({
					accountId: 'accountId',
					refresh: true,
				});
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual({
				accessToken: 'accessToken',
				expiresAt,
				refreshToken:
					refreshTokenRepository.outputs.create.success.refreshToken,
			});
		});

		it('should return only access token', async () => {
			const expiresAt = new Date();

			termsService.mock.hasAcceptedLatest.mockResolvedValue(true);
			tokenAdapter.mock.genAccess.mockReturnValue({
				accessToken: 'accessToken',
				expiresAt,
			});

			let result;
			try {
				result = await service.genAuthOutput({
					accountId: 'accountId',
					refresh: false,
				});
			} catch (err) {
				result = err;
			}

			expect(result).toMatchObject({
				accessToken: 'accessToken',
				expiresAt,
			});
			expect(result.refreshToken).toBeUndefined();
			expect(refreshTokenRepository.mock.create).not.toHaveBeenCalled();
		});

		it("should return terms from database if it's not first access (true)", async () => {
			const terms = true;

			termsService.mock.hasAcceptedLatest.mockResolvedValue(terms);
			tokenAdapter.mock.genAccess.mockImplementation((i: any) => ({
				accessToken: JSON.stringify(i),
				expiresAt: new Date(),
			}));

			let result;
			try {
				result = await service.genAuthOutput({
					accountId: 'accountId',
					refresh: false,
				});
			} catch (err) {
				result = err;
			}

			expect(result).toMatchObject({
				accessToken: JSON.stringify({
					accountId: 'accountId',
					hasAcceptedLatestTerms: terms,
				}),
			});
		});

		it("should return terms from database if it's not first access (false)", async () => {
			const terms = false;

			termsService.mock.hasAcceptedLatest.mockResolvedValue(terms);
			tokenAdapter.mock.genAccess.mockImplementation((i: any) => ({
				accessToken: JSON.stringify(i),
				expiresAt: new Date(),
			}));

			let result;
			try {
				result = await service.genAuthOutput({
					accountId: 'accountId',
					refresh: false,
				});
			} catch (err) {
				result = err;
			}

			expect(result).toMatchObject({
				accessToken: JSON.stringify({
					accountId: 'accountId',
					hasAcceptedLatestTerms: terms,
				}),
			});
		});
	});
});

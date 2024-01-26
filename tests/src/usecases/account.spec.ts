import type { INestApplication } from '@nestjs/common';
import { AccountModule } from 'usecases/account/account.module';
import { AccountService } from 'usecases/account/account.service';
import { makeAccountRepositoryMock } from '../../mocks/repositories/postgres/account';
import { SignInProviderEnum } from '@prisma/client';
import { createTestModule, createTestService } from '../../utils';

describe('Usecases > Account', () => {
	let service: AccountService;
	let module: INestApplication;

	const accountRepository = makeAccountRepositoryMock();

	beforeAll(async () => {
		try {
			service = await createTestService<AccountService>(AccountService, {
				providers: [accountRepository.module],
			});

			module = await createTestModule(AccountModule);
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

	describe('> iam', () => {
		it("should return the user's IDs", async () => {
			const account = {
				...accountRepository.base,
				signInProviders: [],
			};

			accountRepository.mock.getByIdWithProviders.mockResolvedValue(account);

			let result;
			try {
				result = await service.iam({
					accountId: account.id,
				});
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual({
				id: account.id,
				googleId: undefined,
			});
		});

		it("should return the user's IDs (with google)", async () => {
			const account = {
				...accountRepository.base,
				signInProviders: [
					{
						accountId: accountRepository.base.id,
						provider: SignInProviderEnum.GOOGLE,
						providerId: 'providerId',
						accessToken: 'accessToken',
						refreshToken: 'refreshToken',
						expiresAt: new Date(),
					},
				],
			};

			accountRepository.mock.getByIdWithProviders.mockResolvedValue(account);

			let result;
			try {
				result = await service.iam({
					accountId: account.id,
				});
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual({
				id: account.id,
				googleId: account.signInProviders[0].providerId,
			});
		});

		it('should fail id account not found', async () => {
			accountRepository.mock.getByIdWithProviders.mockResolvedValue(undefined);

			let result;
			try {
				result = await service.iam({
					accountId: 'accountId',
				});
			} catch (err) {
				result = err;
			}

			expect(result).toBeInstanceOf(Error);
			expect(result.status).toBe(401);
			expect(result.message).toBe('User not found');
		});
	});

	describe('> updateName', () => {
		it("should update user's name", async () => {
			accountRepository.mock.updateConfig.mockResolvedValue(undefined);

			let result;
			try {
				result = await service.updateName({
					accountId: 'accountId',
					name: 'Foo Bar',
				});
			} catch (err) {
				result = err;
			}

			expect(result).toBeUndefined();
			expect(accountRepository.mock.updateConfig).toHaveBeenCalled();
		});
	});

	describe('> setBudget', () => {
		it("should update user's budget", async () => {
			accountRepository.mock.updateConfig.mockResolvedValue(undefined);

			let result;
			try {
				result = await service.setBudget({
					accountId: 'accountId',
					budgetId: 'budgetId',
				});
			} catch (err) {
				result = err;
			}

			expect(result).toBeUndefined();
			expect(accountRepository.mock.updateConfig).toHaveBeenCalled();
		});
	});
});

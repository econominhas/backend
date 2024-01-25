import { Test } from '@nestjs/testing';
import { JWTAdapterService } from 'adapters/implementations/jwt/token.service';
import { makeJwtMock } from '../../mocks/libs/jsonwebtoken';
import { UIDAdapterModule } from 'adapters/implementations/uid/uid.module';
import { configMock, configMockModule } from '../../mocks/config';
import { JWTAdapterModule } from 'adapters/implementations/jwt/token.module';
import type { INestApplication } from '@nestjs/common';

describe('Adapters > JWT', () => {
	let service: JWTAdapterService;
	let module: INestApplication;

	const jwtMock = makeJwtMock();

	beforeAll(async () => {
		try {
			const moduleForService = await Test.createTestingModule({
				imports: [UIDAdapterModule],
				providers: [
					{
						provide: 'jsonwebtoken',
						useValue: jwtMock,
					},
					configMockModule,
					JWTAdapterService,
				],
			}).compile();

			service = moduleForService.get<JWTAdapterService>(JWTAdapterService);

			const moduleForModule = await Test.createTestingModule({
				imports: [JWTAdapterModule],
			}).compile();

			module = moduleForModule.createNestApplication();
		} catch (err) {
			console.error(err);
		}
	});

	beforeEach(() => {
		jwtMock.resetMock();
	});

	describe('definitions', () => {
		it('should initialize Service', () => {
			expect(service).toBeDefined();
		});

		it('should initialize Module', async () => {
			expect(module).toBeDefined();
		});
	});

	describe('> genAccess', () => {
		it('should generate access token', async () => {
			jwtMock.sign.mockImplementation(
				(data: Record<string, string>, secret: string) =>
					`${JSON.stringify(data)}${secret}`,
			);

			let result;
			try {
				result = await service.genAccess({
					accountId: 'accountId',
					hasAcceptedLatestTerms: true,
				});
			} catch (err) {
				result = err;
			}

			expect(result).toMatchObject({
				expiresAt: '',
				accessToken: `{"sub":"accountId","terms":true}${configMock.get(
					'JWT_SECRET',
				)}`,
			});
		});
	});

	describe('> validateAccess', () => {
		it('should return payload from access token', async () => {
			jwtMock.verify.mockImplementation(
				(dataStringified: string, secret: string) =>
					JSON.parse(dataStringified.replace(secret, '')),
			);

			let result;
			try {
				result = await service.validateAccess({
					accessToken: `{"sub":"accountId","terms":true}${configMock.get(
						'JWT_SECRET',
					)}`,
				});
			} catch (err) {
				result = err;
			}

			expect(result).toMatchObject({
				sub: 'accountId',
				terms: true,
			});
		});

		it('should return undefined if error', async () => {
			jwtMock.verify.mockImplementation(() => {
				throw new Error();
			});

			let result;
			try {
				result = await service.validateAccess({
					accessToken: 'foo',
				});
			} catch (err) {
				result = err;
			}

			expect(result).toBeUndefined();
		});
	});

	describe('> genRefresh', () => {
		it('should generate refresh token', async () => {
			let result;
			try {
				result = await service.genRefresh();
			} catch (err) {
				result = err;
			}

			expect(result).not.toBeInstanceOf(Error);
			expect(result).toHaveProperty('refreshToken');
			expect(result.refreshToken).toHaveLength(64);
			expect(result.refreshToken).toMatch(/^[a-fA-F0-9]*$/);
		});
	});
});

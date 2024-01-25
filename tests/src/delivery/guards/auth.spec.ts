import { Reflector } from '@nestjs/core';
import {
	AuthGuard,
	IgnoreTermsCheck,
	Public,
} from 'delivery/guards/auth.guard';

describe('Delivery > Guards', () => {
	const reflectorMock = {
		get: jest.fn(),
	};
	const tokenMock = {
		validateAccess: jest.fn(),
	};
	const makeContextMock = () => {
		const requestMock = jest.fn();

		return {
			getHandler: jest.fn(),
			requestMock,
			switchToHttp: () => ({
				getRequest: requestMock,
			}),
		};
	};

	const guard = new AuthGuard(reflectorMock as any, tokenMock as any);

	beforeEach(() => {
		reflectorMock.get.mockReset();
	});

	describe('> Auth', () => {
		it('should return true if public', async () => {
			reflectorMock.get.mockReturnValue(true);

			const contextMock = makeContextMock();

			let result;
			try {
				result = await guard.canActivate(contextMock as any);
			} catch (err) {
				result = err;
			}

			expect(result).toBeTruthy();
		});

		it('should return false without auth header', async () => {
			reflectorMock.get.mockReturnValue(false);

			const contextMock = makeContextMock();
			contextMock.requestMock.mockReturnValue({
				headers: {},
			});

			let result;
			try {
				result = await guard.canActivate(contextMock as any);
			} catch (err) {
				result = err;
			}

			expect(result).toBeFalsy();
		});

		it('should return false if token is not Bearer', async () => {
			reflectorMock.get.mockReturnValue(false);

			const contextMock = makeContextMock();
			contextMock.requestMock.mockReturnValue({
				headers: {
					authorization: 'foo bar',
				},
			});

			let result;
			try {
				result = await guard.canActivate(contextMock as any);
			} catch (err) {
				result = err;
			}

			expect(result).toBeFalsy();
		});

		it("should return false if don't have token", async () => {
			reflectorMock.get.mockReturnValue(false);

			const contextMock = makeContextMock();
			contextMock.requestMock.mockReturnValue({
				headers: {
					authorization: 'Bearer',
				},
			});

			let result;
			try {
				result = await guard.canActivate(contextMock as any);
			} catch (err) {
				result = err;
			}

			expect(result).toBeFalsy();
		});

		it('should return false if invalid token', async () => {
			reflectorMock.get.mockReturnValue(false);

			const contextMock = makeContextMock();
			contextMock.requestMock.mockReturnValue({
				headers: {
					authorization: 'Bearer foo',
				},
			});

			tokenMock.validateAccess.mockReturnValue(undefined);

			let result;
			try {
				result = await guard.canActivate(contextMock as any);
			} catch (err) {
				result = err;
			}

			expect(result).toBeFalsy();
		});

		it('should return false if terms flag and terms not accepted', async () => {
			reflectorMock.get.mockReturnValueOnce(false);

			const contextMock = makeContextMock();
			contextMock.requestMock.mockReturnValue({
				headers: {
					authorization: 'Bearer foo',
				},
			});

			tokenMock.validateAccess.mockReturnValue({
				sub: 'accountId',
				terms: false,
			});

			reflectorMock.get.mockReturnValueOnce(false);

			let result;
			try {
				result = await guard.canActivate(contextMock as any);
			} catch (err) {
				result = err;
			}

			expect(result).toBeFalsy();
		});

		it('should return false if fail to validate', async () => {
			reflectorMock.get.mockReturnValueOnce(false);

			const contextMock = makeContextMock();
			contextMock.requestMock.mockReturnValue({
				headers: {
					authorization: 'Bearer foo',
				},
			});

			tokenMock.validateAccess.mockImplementation(() => {
				throw new Error();
			});

			reflectorMock.get.mockReturnValueOnce(false);

			let result;
			try {
				result = await guard.canActivate(contextMock as any);
			} catch (err) {
				result = err;
			}

			expect(result).toBeFalsy();
		});

		it('should return true if terms flag and terms accepted', async () => {
			reflectorMock.get.mockReturnValueOnce(false);

			const contextMock = makeContextMock();
			contextMock.requestMock.mockReturnValue({
				headers: {
					authorization: 'Bearer foo',
				},
			});

			tokenMock.validateAccess.mockReturnValue({
				sub: 'accountId',
				terms: true,
			});

			reflectorMock.get.mockReturnValueOnce(false);

			let result;
			try {
				result = await guard.canActivate(contextMock as any);
			} catch (err) {
				result = err;
			}

			expect(result).toBeTruthy();
		});
	});

	describe('> Public', () => {
		const reflector = new Reflector();

		it('should set metadata', () => {
			let result;
			try {
				class Foo {
					@Public()
					bar() {}
				}

				result = reflector.get('isPublic', new Foo().bar);
			} catch (err) {
				result = err;
			}

			expect(result).toBeDefined();
			expect(result).toBeTruthy();
		});
	});

	describe('> IgnoreTermsCheck', () => {
		const reflector = new Reflector();

		it('should set metadata', () => {
			let result;
			try {
				class Foo {
					@IgnoreTermsCheck()
					bar() {}
				}

				result = reflector.get('ignoreTermsCheck', new Foo().bar);
			} catch (err) {
				result = err;
			}

			expect(result).toBeDefined();
			expect(result).toBeTruthy();
		});
	});
});

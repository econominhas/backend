import { validate } from 'delivery/decorators/user-data';

describe('Delivery > Decorators', () => {
	describe('> UserData', () => {
		it('should get user data', () => {
			let result;
			try {
				result = validate(undefined, {
					switchToHttp: () => ({
						getRequest: () => ({
							headers: {
								authorization:
									'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhY2NvdW50SWQiLCJ0ZXJtcyI6dHJ1ZX0._Xha--8lvBSdfY8cQ3_Kup1eEM12N4nHceflRXtuZHY',
							},
						}),
					}),
				} as any);
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual({
				accountId: 'accountId',
				hasAcceptedLatestTerms: true,
			});
		});

		it('should return empty object if no auth header', () => {
			let result;
			try {
				result = validate(undefined, {
					switchToHttp: () => ({
						getRequest: () => ({
							headers: {},
						}),
					}),
				} as any);
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual({});
		});

		it('should return undefined if fail to decode', () => {
			let result;
			try {
				result = validate(undefined, {
					switchToHttp: () => ({
						getRequest: () => ({
							headers: {
								authorization: 'Bearer foo',
							},
						}),
					}),
				} as any);
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual({});
		});
	});
});

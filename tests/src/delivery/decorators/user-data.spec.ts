import { validate } from "../../../../src/delivery/decorators/user-data";

describe("Delivery > Decorators", () => {
	describe("> UserData", () => {
		it("should get user data", () => {
			let result;
			try {
				result = validate(undefined, {
					switchToHttp: () => ({
						getRequest: () => ({
							headers: {
								authorization:
									"Bearer v4.public.eyJzdWIiOiJhY2NvdW50SWQiLCJ0ZXJtcyI6dHJ1ZSwiZXhwIjoiMjAyNC0wMS0wMVQwMzowMDowMC4wMDBaIiwiaWF0IjoiMjAyNC0wNC0wMlQxMTo1MDoyMi41NDBaIn1KoyJFS_wNB6nqMHV8N92RL3kJoPdy3ONjBe5OoLUsd62l5EhJi2OYXe8aHXMhBDpkS2jmUAyYQTxXGuY0fJwM",
							},
						}),
					}),
				} as any);
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual({
				accountId: "accountId",
				hasAcceptedLatestTerms: true,
			});
		});

		it("should return empty object if no auth header", () => {
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

		it("should return undefined if fail to decode", () => {
			let result;
			try {
				result = validate(undefined, {
					switchToHttp: () => ({
						getRequest: () => ({
							headers: {
								authorization: "Bearer foo",
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

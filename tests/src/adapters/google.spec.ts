import { type INestApplication } from "@nestjs/common";

import { GoogleAdapterModule } from "../../../src/adapters/implementations/google/google.module";
import { GoogleAdapterService } from "../../../src/adapters/implementations/google/google.service";
import { DayJsAdapterModule } from "../../../src/adapters/implementations/dayjs/dayjs.module";
import { makeAxiosMock } from "../../mocks/libs/axios";
import { createTestModule, createTestService, removeMillis } from "../../utils";
import { makeConfigMock } from "../../mocks/config";

const googleTokenUrl = "https://oauth2.googleapis.com/token";
const googleUserDataUrl = "https://openidconnect.googleapis.com/v1/userinfo";

describe("Adapters > Google", () => {
	let service: GoogleAdapterService;
	let module: INestApplication;

	const configMock = makeConfigMock();
	const axiosMock = makeAxiosMock();

	beforeAll(async () => {
		service = await createTestService<GoogleAdapterService>(
			GoogleAdapterService,
			{
				imports: [DayJsAdapterModule],
				providers: [
					{
						provide: "axios",
						useValue: axiosMock,
					},
					configMock.module,
				],
			},
		);

		module = await createTestModule(GoogleAdapterModule);
	});

	describe("definitions", () => {
		it("should initialize Service", () => {
			expect(service).toBeDefined();
		});

		it("should initialize Module", () => {
			expect(module).toBeDefined();
		});
	});

	describe("> exchangeCode", () => {
		it("should return auth data", async () => {
			const body = {
				code: "foo",
				client_id: configMock.mock.get("GOOGLE_CLIENT_ID")!,
				client_secret: configMock.mock.get("GOOGLE_CLIENT_SECRET")!,
				grant_type: "authorization_code",
			};

			const axiosResponse = {
				access_token: "foo",
				refresh_token: "bar",
				scope: "foo bar fooBar",
				expires_in: 120,
			};

			axiosMock.post.mockResolvedValue({
				data: axiosResponse,
			});

			const date = new Date();
			let result;
			try {
				result = await service.exchangeCode({
					code: body.code,
				});
			} catch (err) {
				result = err;
			}

			expect(result).toMatchObject({
				accessToken: axiosResponse.access_token,
				refreshToken: axiosResponse.refresh_token,
				scopes: axiosResponse.scope.split(" "),
			});
			expect(removeMillis(result.expiresAt)).toBe(
				removeMillis(new Date(date.getTime() + 60 * 1000)),
			);
			expect(axiosMock.post).toHaveBeenCalled();
			expect(axiosMock.post).toHaveBeenCalledWith(
				googleTokenUrl,
				new URLSearchParams(body),
				{
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						"Accept": "application/json",
					},
				},
			);
		});

		it("should return auth data (with originUrl)", async () => {
			const body = {
				code: "foo",
				client_id: configMock.mock.get("GOOGLE_CLIENT_ID")!,
				client_secret: configMock.mock.get("GOOGLE_CLIENT_SECRET")!,
				redirect_uri: "originUrl",
				grant_type: "authorization_code",
			};

			const axiosResponse = {
				access_token: "foo",
				refresh_token: "bar",
				scope: "foo bar fooBar",
				expires_in: 120,
			};

			axiosMock.post.mockResolvedValue({
				data: axiosResponse,
			});

			const date = new Date();
			let result;
			try {
				result = await service.exchangeCode({
					code: body.code,
					originUrl: body.redirect_uri,
				});
			} catch (err) {
				result = err;
			}

			expect(result).toMatchObject({
				accessToken: axiosResponse.access_token,
				refreshToken: axiosResponse.refresh_token,
				scopes: axiosResponse.scope.split(" "),
			});
			expect(removeMillis(result.expiresAt)).toBe(
				removeMillis(new Date(date.getTime() + 60 * 1000)),
			);
			expect(axiosMock.post).toHaveBeenCalled();
			expect(axiosMock.post).toHaveBeenCalledWith(
				googleTokenUrl,
				new URLSearchParams(body),
				{
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						"Accept": "application/json",
					},
				},
			);
		});

		it("should fail if google rejects request", async () => {
			axiosMock.post.mockRejectedValue({
				response: {
					data: {
						error: "error",
					},
				},
			});

			let result;
			try {
				result = await service.exchangeCode({
					code: "code",
					originUrl: "originUrl",
				});
			} catch (err) {
				result = err;
			}

			expect(result).toBeInstanceOf(Error);
			expect(result.message).toBe('{"error":"error"}');
		});

		it("should fail if google rejects request (undefined response)", async () => {
			axiosMock.post.mockRejectedValue({});

			let result;
			try {
				result = await service.exchangeCode({
					code: "code",
					originUrl: "originUrl",
				});
			} catch (err) {
				result = err;
			}

			expect(result).toBeInstanceOf(Error);
			expect(result.message).toBe("{}");
		});
	});

	describe("> getAuthenticatedUserData", () => {
		it("should return user data", async () => {
			const axiosResponse = {
				sub: "sub",
				given_name: "given_name",
				email: "email",
				email_verified: "email_verified",
			};

			axiosMock.get.mockResolvedValue({
				data: axiosResponse,
			});

			let result;
			try {
				result = await service.getAuthenticatedUserData("accessToken");
			} catch (err) {
				result = err;
			}

			expect(result).toMatchObject({
				id: axiosResponse.sub,
				name: axiosResponse.given_name,
				email: axiosResponse.email,
				isEmailVerified: axiosResponse.email_verified,
			});
			expect(axiosMock.get).toHaveBeenCalled();
			expect(axiosMock.get).toHaveBeenCalledWith(googleUserDataUrl, {
				headers: {
					Authorization: "Bearer accessToken",
				},
			});
		});

		it("should fail if google rejects request", async () => {
			axiosMock.get.mockRejectedValue({
				response: {
					data: {
						error: "error",
					},
				},
			});

			let result;
			try {
				result = await service.getAuthenticatedUserData("accessToken");
			} catch (err) {
				result = err;
			}

			expect(result).toBeInstanceOf(Error);
			expect(result.message).toBe('{"error":"error"}');
		});

		it("should fail if google rejects request (undefined response)", async () => {
			axiosMock.get.mockRejectedValue({});

			let result;
			try {
				result = await service.getAuthenticatedUserData("accessToken");
			} catch (err) {
				result = err;
			}

			expect(result).toBeInstanceOf(Error);
			expect(result.message).toBe("{}");
		});
	});
});

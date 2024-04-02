import { type INestApplication } from "@nestjs/common";

import { PasetoAdapterService } from "../../../src/adapters/implementations/paseto/paseto.service";
import { makePasetoMock } from "../../mocks/libs/paseto";
import { UIDAdapterModule } from "../../../src/adapters/implementations/uid/uid.module";
import { makeConfigMock } from "../../mocks/config";
import { createTestModule, createTestService } from "../../utils";
import { PasetoAdapterModule } from "../../../src/adapters/implementations/paseto/paseto.module";
import { DayJsAdapterModule } from "../../../src/adapters/implementations/dayjs/dayjs.module";
import { makeDayjsAdapterMock } from "../../mocks/adapters/dayjs";

describe("Adapters > PASETO", () => {
	let service: PasetoAdapterService;
	let module: INestApplication;

	const EXPIRATION_IN_MINUTES = 15;

	const configMock = makeConfigMock();
	const pasetoMock = makePasetoMock();
	const dayjsMock = makeDayjsAdapterMock();

	beforeAll(async () => {
		service = await createTestService<PasetoAdapterService>(
			PasetoAdapterService,
			{
				imports: [UIDAdapterModule, DayJsAdapterModule],
				providers: [
					{
						provide: "paseto",
						useValue: pasetoMock,
					},
					configMock.module,
					dayjsMock.module,
				],
			},
		);

		module = await createTestModule(PasetoAdapterModule);
	});

	describe("definitions", () => {
		it("should initialize Service", () => {
			expect(service).toBeDefined();
		});

		it("should initialize Module", () => {
			expect(module).toBeDefined();
		});
	});

	describe("> genAccess", () => {
		it("should generate access token", async () => {
			dayjsMock.mock.nowPlus.mockReturnValue({
				toISOString: () => `2024-01-01T00:${EXPIRATION_IN_MINUTES}:00.000Z`,
			});
			pasetoMock.bytesToKeyObject.mockReturnValue("secretKeyObject");
			pasetoMock.sign.mockReturnValue("accessToken");

			const payload = {
				accountId: "accountId",
				hasAcceptedLatestTerms: true,
			};
			let result;
			try {
				result = await service.genAccess(payload);
			} catch (err) {
				result = err;
			}

			expect(pasetoMock.bytesToKeyObject).toHaveBeenCalled();
			expect(pasetoMock.sign).toHaveBeenCalled();
			expect(pasetoMock.sign).toHaveBeenCalledWith(
				{
					sub: payload.accountId,
					terms: payload.hasAcceptedLatestTerms,
					exp: `2024-01-01T00:${EXPIRATION_IN_MINUTES}:00.000Z`,
				},
				"secretKeyObject",
			);
			expect(result).toStrictEqual({
				accessToken: "accessToken",
				expiresAt: `2024-01-01T00:${EXPIRATION_IN_MINUTES}:00.000Z`,
			});
		});
	});

	describe("> validateAccess", () => {
		it("should return payload from access token", async () => {
			const accessToken = "access_token";
			const payload = {
				sub: "accountId",
				terms: true,
			};

			pasetoMock.bytesToKeyObject.mockReturnValue("secretKeyObject");
			pasetoMock.verify.mockResolvedValue(payload);

			let result;
			try {
				result = await service.validateAccess({ accessToken });
			} catch (err) {
				result = err;
			}

			expect(pasetoMock.verify).toHaveBeenCalled();
			expect(pasetoMock.verify).toHaveBeenCalledWith(
				accessToken,
				"secretKeyObject",
			);

			expect(result).toStrictEqual(payload);
		});

		it("should return throw error if fail to validate", async () => {
			const accessToken = "access_token";

			pasetoMock.verify.mockRejectedValue(new Error("Token validation failed"));
			pasetoMock.bytesToKeyObject.mockReturnValue("secretKeyObject");

			let result;
			try {
				result = await service.validateAccess({ accessToken });
			} catch (err) {
				result = err;
			}

			expect(pasetoMock.verify).toHaveBeenCalled();
			expect(pasetoMock.verify).toHaveBeenCalledWith(
				accessToken,
				"secretKeyObject",
			);
			expect(result).toBeInstanceOf(Error);
			expect(result).toStrictEqual(new Error("Token validation failed"));
		});
	});

	describe("> genRefresh", () => {
		it("should generate refresh token", async () => {
			let result;
			try {
				result = await service.genRefresh();
			} catch (err) {
				result = err;
			}

			expect(result).not.toBeInstanceOf(Error);
			expect(result).toHaveProperty("refreshToken");
			expect(result.refreshToken).toHaveLength(64);
			expect(result.refreshToken).toMatch(/^[a-fA-F0-9]*$/);
		});
	});
});

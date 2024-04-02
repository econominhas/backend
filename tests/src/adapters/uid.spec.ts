import { uid } from "uid/secure";
import { type INestApplication } from "@nestjs/common";

import { UIDAdapterModule } from "../../../src/adapters/implementations/uid/uid.module";
import { UIDAdapterService } from "../../../src/adapters/implementations/uid/uid.service";
import { createTestModule, createTestService } from "../../utils";

describe("Adapters > UID", () => {
	let service: UIDAdapterService;
	let module: INestApplication;

	beforeAll(async () => {
		service = await createTestService<UIDAdapterService>(UIDAdapterService, {
			providers: [
				{
					provide: "uid/secure",
					useValue: uid,
				},
			],
		});

		module = await createTestModule(UIDAdapterModule);
	});

	describe("definitions", () => {
		it("should initialize Service", () => {
			expect(service).toBeDefined();
		});

		it("should initialize Module", () => {
			expect(module).toBeDefined();
		});
	});

	describe("> genId", () => {
		it("should generate ID", () => {
			let result;
			try {
				result = service.genId();
			} catch (err) {
				result = err;
			}

			expect(typeof result).toBe("string");
			expect(result).toHaveLength(16);
			expect(result).toMatch(/^[a-fA-F0-9]*$/);
		});
	});

	describe("> genSecret", () => {
		it("should generate Secret", () => {
			let result;
			try {
				result = service.genSecret();
			} catch (err) {
				result = err;
			}

			expect(typeof result).toBe("string");
			expect(result).toHaveLength(32);
			expect(result).toMatch(/^[a-fA-F0-9]*$/);
		});
	});

	describe("> genSuperSecret", () => {
		it("should generate Super Secret", () => {
			let result;
			try {
				result = service.genSuperSecret();
			} catch (err) {
				result = err;
			}

			expect(typeof result).toBe("string");
			expect(result).toHaveLength(64);
			expect(result).toMatch(/^[a-fA-F0-9]*$/);
		});
	});
});

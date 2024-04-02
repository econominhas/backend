import { type INestApplication } from "@nestjs/common";

import { UtilsAdapterService } from "../../../src/adapters/implementations/utils/utils.service";
import { UtilsAdapterModule } from "../../../src/adapters/implementations/utils/utils.module";
import { createTestModule, createTestService } from "../../utils";

describe("Adapters > Utils", () => {
	let service: UtilsAdapterService;
	let module: INestApplication;

	beforeAll(async () => {
		service = await createTestService<UtilsAdapterService>(UtilsAdapterService);

		module = await createTestModule(UtilsAdapterModule);
	});

	describe("definitions", () => {
		it("should initialize Service", () => {
			expect(service).toBeDefined();
		});

		it("should initialize Module", () => {
			expect(module).toBeDefined();
		});
	});

	describe("> pagination", () => {
		it("should get pagination data (empty params)", () => {
			let result;
			try {
				result = service.pagination({});
			} catch (err) {
				result = err;
			}

			expect(result).toMatchObject({
				paging: {
					curPage: 1,
					nextPage: 2,
					limit: 15,
				},
				limit: 15,
				offset: 0,
			});
		});

		it("should get pagination data (with page)", () => {
			let result;
			try {
				result = service.pagination({
					page: 10,
				});
			} catch (err) {
				result = err;
			}

			expect(result).toMatchObject({
				paging: {
					curPage: 10,
					nextPage: 11,
					prevPage: 9,
					limit: 15,
				},
				limit: 15,
				offset: 135,
			});
		});

		it("should get pagination data (with limit)", () => {
			let result;
			try {
				result = service.pagination({
					limit: 10,
				});
			} catch (err) {
				result = err;
			}

			expect(result).toMatchObject({
				paging: {
					curPage: 1,
					nextPage: 2,
					limit: 10,
				},
				limit: 10,
				offset: 0,
			});
		});

		it("should get pagination data (with page and limit)", () => {
			let result;
			try {
				result = service.pagination({
					page: 10,
					limit: 10,
				});
			} catch (err) {
				result = err;
			}

			expect(result).toMatchObject({
				paging: {
					curPage: 10,
					nextPage: 11,
					limit: 10,
				},
				limit: 10,
				offset: 90,
			});
		});
	});

	describe("> formatMoney", () => {
		it("should get money formatted (R$0,01)", () => {
			let result;
			try {
				result = service.formatMoney(1);
			} catch (err) {
				result = err;
			}

			expect(result).toBe("R$ 0,01");
		});

		it("should get money formatted (R$0,10)", () => {
			let result;
			try {
				result = service.formatMoney(10);
			} catch (err) {
				result = err;
			}

			expect(result).toBe("R$ 0,10");
		});

		it("should get money formatted (R$1,00)", () => {
			let result;
			try {
				result = service.formatMoney(100);
			} catch (err) {
				result = err;
			}

			expect(result).toBe("R$ 1,00");
		});

		it("should get money formatted (R$10,00)", () => {
			let result;
			try {
				result = service.formatMoney(1000);
			} catch (err) {
				result = err;
			}

			expect(result).toBe("R$ 10,00");
		});

		it("should get money formatted (R$99,09)", () => {
			let result;
			try {
				result = service.formatMoney(9909);
			} catch (err) {
				result = err;
			}

			expect(result).toBe("R$ 99,09");
		});
	});
});

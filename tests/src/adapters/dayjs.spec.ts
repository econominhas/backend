import { type INestApplication } from "@nestjs/common";

import { DayJsAdapterModule } from "../../../src/adapters/implementations/dayjs/dayjs.module";
import { DayjsAdapterService } from "../../../src/adapters/implementations/dayjs/dayjs.service";
import { createTestModule, createTestService, removeMillis } from "../../utils";

const formatDate = (dateArr: [number, number, number]) =>
	dateArr.map(v => v.toString().padStart(2, "0")).join("-");

describe("Adapters > DayJs", () => {
	let service: DayjsAdapterService;
	let module: INestApplication;

	const baseDate1 = "2023-01-01";
	const baseDate2 = "2024-01-01";

	beforeAll(async () => {
		service = await createTestService<DayjsAdapterService>(DayjsAdapterService);

		module = await createTestModule(DayJsAdapterModule);
	});

	describe("definitions", () => {
		it("should initialize Service", () => {
			expect(service).toBeDefined();
		});

		it("should initialize Module", () => {
			expect(module).toBeDefined();
		});
	});

	/**
	 *
	 * Info
	 *
	 */

	describe("> today", () => {
		it("should get todays info", () => {
			let result;
			try {
				result = service.today();
			} catch (err) {
				result = err;
			}

			const todayDate = new Date();

			expect(result).toMatchObject({
				day: todayDate.getUTCDate(),
				month: todayDate.getUTCMonth() + 1,
				year: todayDate.getUTCFullYear(),
			});
			// Removes the milliseconds so it don't create false positives
			expect(removeMillis(result.date)).toBe(removeMillis(todayDate));
		});
	});

	describe("> newDate", () => {
		it("should create a new UTC date", () => {
			let result;
			try {
				result = service.newDate(baseDate1).toISOString();
			} catch (err) {
				result = err;
			}

			expect(result).toBe(`${baseDate1}T00:00:00.000Z`);
		});
	});

	describe("> get", () => {
		it("should get the day", () => {
			let result;
			try {
				result = service.get(baseDate1, "day");
			} catch (err) {
				result = err;
			}

			expect(result).toBe(1);
		});

		it("should get the month", () => {
			let result;
			try {
				result = service.get(baseDate1, "month");
			} catch (err) {
				result = err;
			}

			expect(result).toBe(1);
		});

		it("should get the year", () => {
			let result;
			try {
				result = service.get(baseDate1, "year");
			} catch (err) {
				result = err;
			}

			expect(result).toBe(2023);
		});
	});

	describe("> getNextMonths", () => {
		it("should get a list of the next months (same year)", () => {
			let result;
			try {
				result = service.getNextMonths(baseDate1, 5);
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual([
				new Date("2023-01-01T00:00:00.000Z"),
				new Date("2023-02-01T00:00:00.000Z"),
				new Date("2023-03-01T00:00:00.000Z"),
				new Date("2023-04-01T00:00:00.000Z"),
				new Date("2023-05-01T00:00:00.000Z"),
			]);
		});

		it("should get a list of the next months (different years)", () => {
			let result;
			try {
				result = service.getNextMonths("2023-12-01", 5);
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual([
				new Date("2023-12-01T00:00:00.000Z"),
				new Date("2024-01-01T00:00:00.000Z"),
				new Date("2024-02-01T00:00:00.000Z"),
				new Date("2024-03-01T00:00:00.000Z"),
				new Date("2024-04-01T00:00:00.000Z"),
			]);
		});
	});

	describe("> statementDate", () => {
		it("should get card statement date of current month", () => {
			let result;
			try {
				result = service.statementDate(15, 7);
			} catch (err) {
				result = err;
			}

			const today = service.today();

			const expectedResult = service.newDate(
				formatDate([today.year, today.month, 8]),
			);

			expect(result).toStrictEqual(expectedResult);
		});

		it("should get card statement date of prev month", () => {
			const dueDay = 15;
			const statementDays = 7;
			const monthsToAdd = -1;

			let result;
			try {
				result = service.statementDate(dueDay, statementDays, monthsToAdd);
			} catch (err) {
				result = err;
			}

			const today = service.today();

			const nextMonth = service.sub(
				[today.year, today.month, dueDay].join("-"),
				monthsToAdd * -1,
				"month",
			);

			const expectedResult = service.sub(nextMonth, statementDays, "day");

			expect(result).toStrictEqual(expectedResult);
		});

		it("should get card statement date of next month", () => {
			const dueDay = 15;
			const statementDays = 7;
			const monthsToAdd = 1;

			let result;
			try {
				result = service.statementDate(dueDay, statementDays, monthsToAdd);
			} catch (err) {
				result = err;
			}

			const today = service.today();

			const nextMonth = service.add(
				formatDate([today.year, today.month, dueDay]),
				monthsToAdd,
				"month",
			);
			const expectedResult = service.sub(nextMonth, statementDays, "day");

			expect(result).toStrictEqual(expectedResult);
		});
	});

	describe("> dueDate", () => {
		it("should get card due date of current month", () => {
			let result;
			try {
				result = service.dueDate(15);
			} catch (err) {
				result = err;
			}

			const today = service.today();

			const expectedResult = service.newDate(
				formatDate([today.year, today.month, 15]),
			);

			expect(result).toStrictEqual(expectedResult);
		});

		it("should get card due date of prev month", () => {
			const dueDay = 15;
			const monthsToAdd = -1;

			let result;
			try {
				result = service.dueDate(dueDay, monthsToAdd);
			} catch (err) {
				result = err;
			}

			const today = service.today();

			const expectedResult = service.add(
				formatDate([today.year, today.month, dueDay]),
				monthsToAdd,
				"month",
			);

			expect(result).toStrictEqual(expectedResult);
		});

		it("should get card due date of next month", () => {
			const dueDay = 15;
			const monthsToAdd = 1;

			let result;
			try {
				result = service.dueDate(dueDay, monthsToAdd);
			} catch (err) {
				result = err;
			}

			const today = service.today();

			const expectedResult = service.add(
				formatDate([today.year, today.month, dueDay]),
				monthsToAdd,
				"month",
			);

			expect(result).toStrictEqual(expectedResult);
		});
	});

	/**
	 *
	 * Comparison
	 *
	 */

	describe("> isSameMonth", () => {
		it("should check if two dates are in the same year and month (true)", () => {
			const date1 = baseDate1;
			const date2 = "2023-01-07";

			let result;
			try {
				result = service.isSameMonth(date1, date2);
			} catch (err) {
				result = err;
			}

			expect(result).toBeTruthy();
		});

		it("should check if two dates are in the same year and month (false - different years)", () => {
			const date1 = baseDate1;
			const date2 = baseDate2;

			let result;
			try {
				result = service.isSameMonth(date1, date2);
			} catch (err) {
				result = err;
			}

			expect(result).toBeFalsy();
		});

		it("should check if two dates are in the same year and month (false - different months)", () => {
			const date1 = baseDate1;
			const date2 = "2023-02-01";

			let result;
			try {
				result = service.isSameMonth(date1, date2);
			} catch (err) {
				result = err;
			}

			expect(result).toBeFalsy();
		});
	});

	describe("> isAfterToday", () => {
		it("should check if a date is after today (true)", () => {
			const tomorrow = service.add(service.today().date, 1, "day");

			let result;
			try {
				result = service.isAfterToday(tomorrow);
			} catch (err) {
				result = err;
			}

			expect(result).toBeTruthy();
		});

		it("should check if a date is after today (false = is today)", () => {
			let result;
			try {
				result = service.isAfterToday(service.today().date);
			} catch (err) {
				result = err;
			}

			expect(result).toBeFalsy();
		});

		it("should check if a date is after today (false - yesterday)", () => {
			const yesterday = service.sub(service.today().date, 1, "day");

			let result;
			try {
				result = service.isAfterToday(yesterday);
			} catch (err) {
				result = err;
			}

			expect(result).toBeFalsy();
		});
	});

	/**
	 *
	 * Modifiers
	 *
	 */

	describe("> nowPlus", () => {
		it("should add 1 day", () => {
			const tomorrow = service.add(service.today().date, 1, "day");

			let result;
			try {
				result = service.nowPlus(1, "day");
			} catch (err) {
				result = err;
			}

			expect(removeMillis(result)).toBe(removeMillis(tomorrow));
		});

		it("should subtract 1 day", () => {
			const yesterday = service.add(service.today().date, -1, "day");

			let result;
			try {
				result = service.nowPlus(-1, "day");
			} catch (err) {
				result = err;
			}

			expect(removeMillis(result)).toBe(removeMillis(yesterday));
		});
	});

	describe("> add", () => {
		it("should add 1 day", () => {
			let result;
			try {
				result = service.add(baseDate2, 1, "day");
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual(service.newDate("2024-01-02"));
		});

		it("should add 1 month", () => {
			let result;
			try {
				result = service.add(baseDate2, 1, "month");
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual(service.newDate("2024-02-01"));
		});

		it("should add 1 year", () => {
			let result;
			try {
				result = service.add(baseDate1, 1, "year");
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual(service.newDate(baseDate2));
		});

		it("should add 1 month (february)", () => {
			let result;
			try {
				result = service.add("2024-01-30", 1, "month");
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual(service.newDate("2024-02-29"));
		});

		it("should add 1 month (february - leap)", () => {
			let result;
			try {
				result = service.add("2024-01-29", 1, "month");
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual(service.newDate("2024-02-29"));
		});
	});

	describe("> sub", () => {
		it("should subtract 1 day", () => {
			let result;
			try {
				result = service.sub("2024-01-02", 1, "day");
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual(service.newDate(baseDate2));
		});

		it("should subtract 1 month", () => {
			let result;
			try {
				result = service.sub("2024-02-01", 1, "month");
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual(service.newDate(baseDate2));
		});

		it("should subtract 2 months", () => {
			let result;
			try {
				result = service.sub("2024-02-01", 2, "month");
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual(service.newDate("2023-12-01"));
		});

		it("should subtract 1 year", () => {
			let result;
			try {
				result = service.sub(baseDate2, 1, "year");
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual(service.newDate(baseDate1));
		});

		it("should subtract 1 month (february)", () => {
			let result;
			try {
				result = service.sub("2024-03-30", 1, "month");
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual(service.newDate("2024-02-29"));
		});

		it("should subtract 1 month (february - leap)", () => {
			let result;
			try {
				result = service.sub("2024-03-29", 1, "month");
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual(service.newDate("2024-02-29"));
		});
	});

	describe("> startOf", () => {
		it("should get the start of the day", () => {
			let result;
			try {
				result = service.startOf("2024-01-01T16:00:00.000Z", "day");
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual(service.newDate("2024-01-01T00:00:00.000Z"));
		});

		it("should get the start of the month", () => {
			let result;
			try {
				result = service.startOf("2024-01-15", "month");
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual(service.newDate(baseDate2));
		});

		it("should get the start of the year", () => {
			let result;
			try {
				result = service.startOf("2024-01-15", "year");
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual(service.newDate(baseDate2));
		});
	});

	describe("> endOf", () => {
		it("should get the end of the day", () => {
			let result;
			try {
				result = service.endOf("2024-01-01T16:00:00.000Z", "day");
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual(service.newDate("2024-01-01T23:59:59.999Z"));
		});

		it("should get the end of the month", () => {
			let result;
			try {
				result = service.endOf("2024-01-15", "month");
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual(service.newDate("2024-01-31T23:59:59.999Z"));
		});

		it("should get the end of the year", () => {
			let result;
			try {
				result = service.endOf("2024-01-15", "year");
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual(service.newDate("2024-12-31T23:59:59.999Z"));
		});
	});
});

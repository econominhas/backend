import type { INestApplication } from '@nestjs/common';
import { DayJsAdapterModule } from 'adapters/implementations/dayjs/dayjs.module';
import { DayjsAdapterService } from 'adapters/implementations/dayjs/dayjs.service';
import { createTestModule, createTestService, removeMillis } from '../../utils';

describe('Adapters > DayJs', () => {
	let service: DayjsAdapterService;
	let module: INestApplication;

	beforeAll(async () => {
		try {
			service =
				await createTestService<DayjsAdapterService>(DayjsAdapterService);

			module = await createTestModule(DayJsAdapterModule);
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

	/**
	 *
	 * Info
	 *
	 */

	describe('> today', () => {
		it('should get todays info', async () => {
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

	describe('> newDate', () => {
		it('should create a new UTC date', async () => {
			const date = '2023-01-01';

			let result;
			try {
				result = service.newDate(date).toISOString();
			} catch (err) {
				result = err;
			}

			expect(result).toBe(`${date}T00:00:00.000Z`);
		});
	});

	describe('> get', () => {
		it('should get the day', async () => {
			const date = '2023-01-01';

			let result;
			try {
				result = service.get(date, 'day');
			} catch (err) {
				result = err;
			}

			expect(result).toBe(1);
		});

		it('should get the month', async () => {
			const date = '2023-01-01';

			let result;
			try {
				result = service.get(date, 'month');
			} catch (err) {
				result = err;
			}

			expect(result).toBe(1);
		});

		it('should get the year', async () => {
			const date = '2023-01-01';

			let result;
			try {
				result = service.get(date, 'year');
			} catch (err) {
				result = err;
			}

			expect(result).toBe(2023);
		});
	});

	describe('> getNextMonths', () => {
		it('should get a list of the next months (same year)', async () => {
			let result;
			try {
				result = service.getNextMonths('2023-01-01', 5);
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual([
				new Date('2023-01-01T00:00:00.000Z'),
				new Date('2023-02-01T00:00:00.000Z'),
				new Date('2023-03-01T00:00:00.000Z'),
				new Date('2023-04-01T00:00:00.000Z'),
				new Date('2023-05-01T00:00:00.000Z'),
			]);
		});

		it('should get a list of the next months (different years)', async () => {
			let result;
			try {
				result = service.getNextMonths('2023-12-01', 5);
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual([
				new Date('2023-12-01T00:00:00.000Z'),
				new Date('2024-01-01T00:00:00.000Z'),
				new Date('2024-02-01T00:00:00.000Z'),
				new Date('2024-03-01T00:00:00.000Z'),
				new Date('2024-04-01T00:00:00.000Z'),
			]);
		});
	});

	describe('> statementDate', () => {
		it('should get card statement date of current month', async () => {
			let result;
			try {
				result = service.statementDate(15, 7);
			} catch (err) {
				result = err;
			}

			const today = service.today();

			const expectedResult = service.newDate(
				[today.year, today.month, 8]
					.map((v) => v.toString().padStart(2, '0'))
					.join('-'),
			);

			expect(result).toStrictEqual(expectedResult);
		});

		it('should get card statement date of prev month', async () => {
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
				[today.year, today.month, dueDay].join('-'),
				monthsToAdd * -1,
				'month',
			);

			const expectedResult = service.sub(nextMonth, statementDays, 'day');

			expect(result).toStrictEqual(expectedResult);
		});

		it('should get card statement date of next month', async () => {
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
				[today.year, today.month, dueDay]
					.map((v) => v.toString().padStart(2, '0'))
					.join('-'),
				monthsToAdd,
				'month',
			);
			const expectedResult = service.sub(nextMonth, statementDays, 'day');

			expect(result).toStrictEqual(expectedResult);
		});
	});

	describe('> dueDate', () => {
		it('should get card due date of current month', async () => {
			let result;
			try {
				result = service.dueDate(15);
			} catch (err) {
				result = err;
			}

			const today = service.today();

			const expectedResult = service.newDate(
				[today.year, today.month, 15]
					.map((v) => v.toString().padStart(2, '0'))
					.join('-'),
			);

			expect(result).toStrictEqual(expectedResult);
		});

		it('should get card due date of prev month', async () => {
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
				[today.year, today.month, dueDay]
					.map((v) => v.toString().padStart(2, '0'))
					.join('-'),
				monthsToAdd,
				'month',
			);

			expect(result).toStrictEqual(expectedResult);
		});

		it('should get card due date of next month', async () => {
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
				[today.year, today.month, dueDay]
					.map((v) => v.toString().padStart(2, '0'))
					.join('-'),
				monthsToAdd,
				'month',
			);

			expect(result).toStrictEqual(expectedResult);
		});
	});

	/**
	 *
	 * Comparison
	 *
	 */

	describe('> isSameMonth', () => {
		it('should check if two dates are in the same year and month (true)', async () => {
			const date1 = '2023-01-01';
			const date2 = '2023-01-07';

			let result;
			try {
				result = service.isSameMonth(date1, date2);
			} catch (err) {
				result = err;
			}

			expect(result).toBeTruthy();
		});

		it('should check if two dates are in the same year and month (false - different years)', async () => {
			const date1 = '2023-01-01';
			const date2 = '2024-01-01';

			let result;
			try {
				result = service.isSameMonth(date1, date2);
			} catch (err) {
				result = err;
			}

			expect(result).toBeFalsy();
		});

		it('should check if two dates are in the same year and month (false - different months)', async () => {
			const date1 = '2023-01-01';
			const date2 = '2023-02-01';

			let result;
			try {
				result = service.isSameMonth(date1, date2);
			} catch (err) {
				result = err;
			}

			expect(result).toBeFalsy();
		});
	});

	describe('> isAfterToday', () => {
		it('should check if a date is after today (true)', async () => {
			const tomorrow = service.add(service.today().date, 1, 'day');

			let result;
			try {
				result = service.isAfterToday(tomorrow);
			} catch (err) {
				result = err;
			}

			expect(result).toBeTruthy();
		});

		it('should check if a date is after today (false = is today)', async () => {
			let result;
			try {
				result = service.isAfterToday(service.today().date);
			} catch (err) {
				result = err;
			}

			expect(result).toBeFalsy();
		});

		it('should check if a date is after today (false - yesterday)', async () => {
			const yesterday = service.sub(service.today().date, 1, 'day');

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

	describe('> nowPlus', () => {
		it('should add 1 day', async () => {
			const tomorrow = service.add(service.today().date, 1, 'day');

			let result;
			try {
				result = service.nowPlus(1, 'day');
			} catch (err) {
				result = err;
			}

			expect(removeMillis(result)).toBe(removeMillis(tomorrow));
		});

		it('should subtract 1 day', async () => {
			const yesterday = service.add(service.today().date, -1, 'day');

			let result;
			try {
				result = service.nowPlus(-1, 'day');
			} catch (err) {
				result = err;
			}

			expect(removeMillis(result)).toBe(removeMillis(yesterday));
		});
	});

	describe('> add', () => {
		it('should add 1 day', async () => {
			let result;
			try {
				result = service.add('2024-01-01', 1, 'day');
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual(service.newDate('2024-01-02'));
		});

		it('should add 1 month', async () => {
			let result;
			try {
				result = service.add('2024-01-01', 1, 'month');
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual(service.newDate('2024-02-01'));
		});

		it('should add 1 year', async () => {
			let result;
			try {
				result = service.add('2023-01-01', 1, 'year');
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual(service.newDate('2024-01-01'));
		});

		it('should add 1 month (february)', async () => {
			let result;
			try {
				result = service.add('2024-01-30', 1, 'month');
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual(service.newDate('2024-02-29'));
		});

		it('should add 1 month (february - leap)', async () => {
			let result;
			try {
				result = service.add('2024-01-29', 1, 'month');
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual(service.newDate('2024-02-29'));
		});
	});

	describe('> sub', () => {
		it('should subtract 1 day', async () => {
			let result;
			try {
				result = service.sub('2024-01-02', 1, 'day');
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual(service.newDate('2024-01-01'));
		});

		it('should subtract 1 month', async () => {
			let result;
			try {
				result = service.sub('2024-02-01', 1, 'month');
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual(service.newDate('2024-01-01'));
		});

		it('should subtract 2 months', async () => {
			let result;
			try {
				result = service.sub('2024-02-01', 2, 'month');
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual(service.newDate('2023-12-01'));
		});

		it('should subtract 1 year', async () => {
			let result;
			try {
				result = service.sub('2024-01-01', 1, 'year');
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual(service.newDate('2023-01-01'));
		});

		it('should subtract 1 month (february)', async () => {
			let result;
			try {
				result = service.sub('2024-03-30', 1, 'month');
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual(service.newDate('2024-02-29'));
		});

		it('should subtract 1 month (february - leap)', async () => {
			let result;
			try {
				result = service.sub('2024-03-29', 1, 'month');
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual(service.newDate('2024-02-29'));
		});
	});

	describe('> startOf', () => {
		it('should get the start of the day', async () => {
			let result;
			try {
				result = service.startOf('2024-01-01T16:00:00.000Z', 'day');
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual(service.newDate('2024-01-01T00:00:00.000Z'));
		});

		it('should get the start of the month', async () => {
			let result;
			try {
				result = service.startOf('2024-01-15', 'month');
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual(service.newDate('2024-01-01'));
		});

		it('should get the start of the year', async () => {
			let result;
			try {
				result = service.startOf('2024-01-15', 'year');
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual(service.newDate('2024-01-01'));
		});
	});

	describe('> endOf', () => {
		it('should get the end of the day', async () => {
			let result;
			try {
				result = service.endOf('2024-01-01T16:00:00.000Z', 'day');
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual(service.newDate('2024-01-01T23:59:59.999Z'));
		});

		it('should get the end of the month', async () => {
			let result;
			try {
				result = service.endOf('2024-01-15', 'month');
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual(service.newDate('2024-01-31T23:59:59.999Z'));
		});

		it('should get the end of the year', async () => {
			let result;
			try {
				result = service.endOf('2024-01-15', 'year');
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual(service.newDate('2024-12-31T23:59:59.999Z'));
		});
	});
});

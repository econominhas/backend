import { Injectable } from '@nestjs/common';
import type {
	DateUnit,
	DateUnitExceptWeek,
	TodayOutput,
	YearMonth,
} from '../../date';
import { DateAdapter } from '../../date';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import type { TimezoneEnum } from 'types/enums/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);

@Injectable()
export class DayjsAdapterService extends DateAdapter {
	/**
	 *
	 * Info
	 *
	 */

	today(timezone?: TimezoneEnum): TodayOutput {
		const today = dayjs.tz(timezone);

		return {
			day: today.date(),
			month: today.month() + 1,
			year: today.year(),
		};
	}

	newDate(date: string, timezone?: TimezoneEnum): Date {
		return dayjs.tz(date, timezone).toDate();
	}

	get(date: string | Date, unit: DateUnitExceptWeek): number {
		return dayjs(date).get(unit);
	}

	getNextMonths(startDate: string | Date, amount: number): Date[] {
		const months: Array<Date> = [];

		let curDate = dayjs(startDate);
		do {
			months.push(curDate.toDate());

			curDate = curDate.add(1, 'month');
		} while (months.length < amount);

		return months;
	}

	statementDate(
		dueDay: number,
		statementDays: number,
		monthsToAdd: number = 0,
	): Date {
		return dayjs()
			.set('day', dueDay)
			.add(monthsToAdd, 'months')
			.add(statementDays * -1, 'days')
			.toDate();
	}

	dueDate(dueDay: number, monthsToAdd: number = 0): Date {
		return dayjs().set('day', dueDay).add(monthsToAdd, 'months').toDate();
	}

	/**
	 *
	 * Comparison
	 *
	 */

	isSameMonth(date: Date | YearMonth, anotherDate: Date | YearMonth): boolean {
		const d1 = dayjs(date);
		const d2 = dayjs(anotherDate);

		const d1Month = d1.get('month');
		const d1Year = d1.get('year');
		const d2Month = d2.get('month');
		const d2Year = d2.get('year');

		const isSameYear = d1Year === d2Year;
		const isSameMonth = d1Month === d2Month;

		return isSameYear && isSameMonth;
	}

	isAfterToday(date: string | Date): boolean {
		return dayjs(date).isAfter(dayjs());
	}

	/**
	 *
	 * Modifiers
	 *
	 */

	nowPlus(amount: number, unit: DateUnit): Date {
		return dayjs.utc().add(amount, unit).toDate();
	}

	add(date: string | Date, amount: number, unit: DateUnit): Date {
		return dayjs(date).add(amount, unit).toDate();
	}

	sub(date: string | Date, amount: number, unit: DateUnit): Date {
		return this.add(date, amount * -1, unit);
	}

	startOf(date: string | Date, unit: DateUnit, timezone?: TimezoneEnum): Date {
		return dayjs.tz(date, timezone).startOf(unit).toDate();
	}

	endOf(date: string | Date, unit: DateUnit, timezone?: TimezoneEnum): Date {
		return dayjs.tz(date, timezone).endOf(unit).toDate();
	}
}

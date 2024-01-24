import { Injectable } from '@nestjs/common';
import type { DateManipulationUnit, TodayOutput, YearMonth } from '../../date';
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

	getMonthsBetween(startDate: YearMonth, endDate: YearMonth): YearMonth[] {
		if (this.isSameMonth(startDate, endDate)) {
			return [startDate];
		}

		const startDateDayjs = dayjs(startDate);

		if (startDateDayjs.isAfter(endDate)) {
			throw new Error('startDate must be before endDate');
		}

		const difference = startDateDayjs.diff(endDate, 'months');
		const THIRTY_FIVE_YEARS_IN_MONTHS = 35 * 12;
		if (difference > THIRTY_FIVE_YEARS_IN_MONTHS) {
			throw new Error(
				'Difference between startDate and endDate must be less than 35 years',
			);
		}

		const dates: Array<YearMonth> = [
			startDateDayjs.format('YYYY-MM') as YearMonth,
		];

		let reached = false;
		const curDate = startDateDayjs;
		do {
			curDate.add(1, 'months');
			dates.push(curDate.format('YYYY-MM') as YearMonth);

			if (curDate.isSameOrAfter(endDate)) {
				reached = true;
			}
		} while (reached);

		return dates;
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

	/**
	 *
	 * Modifiers
	 *
	 */

	nowPlus(amount: number, unit: DateManipulationUnit): Date {
		return dayjs.utc().add(amount, unit).toDate();
	}

	add(date: string | Date, amount: number, unit: DateManipulationUnit): Date {
		return dayjs(date).add(amount, unit).toDate();
	}

	sub(date: string | Date, amount: number, unit: DateManipulationUnit): Date {
		return this.add(date, amount * -1, unit);
	}

	startOf(
		date: string | Date,
		unit: DateManipulationUnit,
		timezone?: TimezoneEnum,
	): Date {
		return dayjs.tz(date, timezone).startOf(unit).toDate();
	}

	endOf(
		date: string | Date,
		unit: DateManipulationUnit,
		timezone?: TimezoneEnum,
	): Date {
		return dayjs.tz(date, timezone).endOf(unit).toDate();
	}
}

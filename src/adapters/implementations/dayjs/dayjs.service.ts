import { Injectable } from '@nestjs/common';
import type {
	DateManipulationUnit,
	GetStatementDatesInput,
	GetStatementDatesOutput,
	GetTodayInfoOutput,
} from '../../date';
import { DateAdapter } from '../../date';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isBetween from 'dayjs/plugin/isBetween';
import type { TimezoneEnum } from 'types/enums/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

@Injectable()
export class DayjsAdapterService extends DateAdapter {
	getTodayInfo(timezone?: TimezoneEnum): GetTodayInfoOutput {
		const today = dayjs.tz(timezone);

		return {
			day: today.date(),
			month: today.month() + 1,
			year: today.year(),
		};
	}

	nowPlus(amount: number, unit: DateManipulationUnit): Date {
		return dayjs.utc().add(amount, unit).toDate();
	}

	isBefore(date: Date, otherDate: Date): boolean {
		return dayjs(date).isBefore(otherDate);
	}

	isAfter(date: Date, otherDate: Date): boolean {
		return dayjs(date).isAfter(otherDate);
	}

	isBetween(dateToCompare: Date, startDate: Date, endDate: Date): boolean {
		return dayjs(dateToCompare).isBetween(startDate, endDate);
	}

	getStatementDates({
		initialDate,
		dueDay,
		statementDays,
		timezone,
	}: GetStatementDatesInput): GetStatementDatesOutput {
		const initialDateDayjs = dayjs.tz(initialDate, timezone).endOf('day');

		const dueDateInCurMonth = dayjs
			.tz(initialDate, timezone)
			.date(dueDay)
			.endOf('day');

		/**
		 * Has this name because it may not be in the
		 * current month, it may be on the previous month,
		 * so to leave it explicit we name it as it belongs
		 */
		const statementDateOfDueDateInCurMonth = dueDateInCurMonth
			.add(-statementDays)
			.endOf('day');

		/**
		 * If the dueDay = 1 and the statementDays = 7, the
		 * statement day will always be in the previous month,
		 * but if the dueDay = 27 and the statementDays = 7,
		 * the statement date will always be at the day 20 of
		 * the month, and depending on initialDate, the bill
		 * can be from the PREVIOUS or NEXT month
		 *
		 * Ex:
		 * If initialDate=2023-01-21, then:
		 * - (initialDate > statementDateOfDueDateInCurMonth)
		 * - dueDateInCurrentMonth = 2023-01-27
		 * - statementDateOfDueDateInCurMonth = 2023-01-20
		 * - start = 2023-01-21
		 * - end = 2023-02-20
		 *
		 * But if initialDate=2023-01-19 / 2023-01-20, then:
		 * - (initialDate <= statementDateOfDueDateInCurMonth)
		 * - initialDate = 2023-01-20
		 * - dueDateInCurrentMonth = 2023-01-27
		 * - statementDateOfDueDateInCurMonth = 2023-01-20
		 * - start = 2022-12-21
		 * - end = 2023-01-20
		 *
		 * Pay attention, because the months don't have the
		 * same amount of days, the can have: 31, 30, 28, 27.
		 * So the statementDateOfDueDateInCurMonth MUST always be calculated on basis
		 * of the dueDate. See an example about february:
		 * - (initialDate > statementDateOfDueDateInCurMonth)
		 * - initialDate = 2023-03-01
		 * - dueDateInCurrentMonth = 2023-03-01
		 * 				^^^^ Note that the dueDate can be in the
		 * 				current month, but it's the dueDate from
		 * 				the PREVIOUS bill, not from the CURRENT one
		 * - statementDateOfDueDateInCurMonth = 2023-02-22
		 * - start = 2023-02-23
		 * - end = 2023-03-25
		 *
		 * KNOW ISSUES: If the user changes the dueDay, so ALL
		 * the previous and current bills will be with the
		 * wrong dates
		 */
		if (initialDateDayjs.isAfter(statementDateOfDueDateInCurMonth)) {
			const start = statementDateOfDueDateInCurMonth
				.add(1, 'day')
				.startOf('day');
			const end = initialDateDayjs
				.add(1, 'month')
				.date(dueDay)
				.add(-statementDays, 'day')
				.endOf('day');

			return {
				start: start.toDate(),
				end: end.toDate(),
			};
		}

		const dueDateInPrevMonth = initialDateDayjs.add(-1, 'month').date(dueDay);
		const statementDateOfDueDateInPrevMonth = dueDateInPrevMonth
			.add(-statementDays)
			.endOf('day');

		const start = statementDateOfDueDateInPrevMonth
			.add(1, 'day')
			.startOf('day');
		const end = statementDateOfDueDateInCurMonth.endOf('day');

		return {
			start: start.toDate(),
			end: end.toDate(),
		};
	}
}

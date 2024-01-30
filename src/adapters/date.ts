import type { TimezoneEnum } from 'types/enums/timezone';

export interface TodayOutput {
	day: number;
	month: number;
	year: number;
	date: Date;
}

export type DateUnit = 'second' | 'day' | 'month' | 'year';

export type YearMonth = `${number}-${number}`;
export type YearMonthDay = `${number}-${number}-${number}`;

export type WeekDays =
	| 'sunday'
	| 'monday'
	| 'tuesday'
	| 'wednesday'
	| 'thursday'
	| 'friday'
	| 'saturday';

export abstract class DateAdapter {
	/**
	 *
	 * Info
	 *
	 */

	abstract today(timezone?: TimezoneEnum): TodayOutput;

	abstract newDate(date?: string | Date, timezone?: TimezoneEnum): Date;

	abstract get(date: Date | string, unit: DateUnit): number;

	abstract diff(
		startDate: Date | string,
		endDate: Date | string,
		unit: DateUnit,
	): number;

	abstract getDayOfWeek(date: string | Date): WeekDays;

	abstract getNextMonths(startDate: Date | string, amount: number): Array<Date>;

	abstract format(date: Date | string): string;

	abstract statementDate(
		dueDay: number,
		statementDays: number,
		monthsToAdd?: number,
	): Date;

	abstract dueDate(dueDay: number, monthsToAdd?: number): Date;

	/**
	 *
	 * Comparison
	 *
	 */

	abstract isSameMonth(
		date: Date | string,
		anotherDate: Date | string,
	): boolean;

	abstract isAfterToday(date: Date | string): boolean;

	/**
	 *
	 * Modifiers
	 *
	 */

	abstract nowPlus(amount: number, unit: DateUnit): Date;

	abstract setDay(date: Date | string, amount: number): Date;

	abstract add(
		date: Date | string,
		amount: number,
		unit: DateUnit | 'week',
	): Date;

	abstract sub(
		date: Date | string,
		amount: number,
		unit: DateUnit | 'week',
	): Date;

	abstract startOf(
		date: Date | string,
		unit: DateUnit,
		timezone?: TimezoneEnum,
	): Date;

	abstract endOf(
		date: Date | string,
		unit: DateUnit,
		timezone?: TimezoneEnum,
	): Date;
}

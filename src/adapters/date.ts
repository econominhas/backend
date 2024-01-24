import type { TimezoneEnum } from 'types/enums/timezone';

export interface TodayOutput {
	day: number;
	month: number;
	year: number;
}

export type DateManipulationUnit = 'second' | 'day' | 'week' | 'month' | 'year';

export type YearMonth = `${number}-${number}`;
export type YearMonthDay = `${number}-${number}-${number}`;

export abstract class DateAdapter {
	/**
	 *
	 * Info
	 *
	 */

	abstract today(timezone?: TimezoneEnum): TodayOutput;

	/**
	 * Return an array of dates ('year-month') in the space
	 * between the start and end dates (including the start
	 * and end dates itself).
	 *
	 * @returns Array of dates: ['2023-01']
	 */
	abstract getMonthsBetween(
		startDate: YearMonth,
		endDate: YearMonth,
	): Array<YearMonth>;

	/**
	 *
	 * Comparison
	 *
	 */

	abstract isSameMonth(
		date: Date | YearMonth,
		anotherDate: Date | YearMonth,
	): boolean;

	/**
	 *
	 * Modifiers
	 *
	 */

	abstract nowPlus(amount: number, unit: DateManipulationUnit): Date;

	abstract add(
		date: Date | string,
		amount: number,
		unit: DateManipulationUnit,
	): Date;

	abstract sub(
		date: Date | string,
		amount: number,
		unit: DateManipulationUnit,
	): Date;

	abstract startOf(
		date: Date | string,
		unit: DateManipulationUnit,
		timezone?: TimezoneEnum,
	): Date;

	abstract endOf(
		date: Date | string,
		unit: DateManipulationUnit,
		timezone?: TimezoneEnum,
	): Date;
}

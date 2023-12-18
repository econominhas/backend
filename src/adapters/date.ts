import type { TimezoneEnum } from 'types/enums/timezone';

export interface GetTodayInfoOutput {
	day: number;
	month: number;
	year: number;
}

export type DateManipulationUnit =
	| 'seconds'
	| 'days'
	| 'weeks'
	| 'months'
	| 'years';

export interface GetStatementDatesInput {
	initialDate: Date;
	dueDay: number;
	statementDays: number;
	timezone?: TimezoneEnum;
}

export interface GetStatementDatesOutput {
	start: Date;
	end: Date;
}

export abstract class DateAdapter {
	abstract getTodayInfo(timezone?: TimezoneEnum): GetTodayInfoOutput;

	abstract isBefore(date: Date, otherDate: Date): boolean;

	abstract isAfter(date: Date, otherDate: Date): boolean;

	abstract isBetween(
		dateToCompare: Date,
		startDate: Date,
		endDate: Date,
	): boolean;

	abstract nowPlus(amount: number, unit: DateManipulationUnit): Date;

	abstract getStatementDates(
		i: GetStatementDatesInput,
	): GetStatementDatesOutput;
}

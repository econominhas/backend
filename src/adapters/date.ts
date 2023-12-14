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

export abstract class DateAdapter {
	abstract getTodayInfo(timezone?: TimezoneEnum): GetTodayInfoOutput;

	abstract nowPlus(amount: number, unit: DateManipulationUnit): Date;
}

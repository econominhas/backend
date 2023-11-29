import type { TimezoneEnum } from 'src/types/enums';

export interface GetTodayInfoOutput {
	day: number;
	month: number;
	year: number;
}

export abstract class DateAdapter {
	abstract getTodayInfo(timezone?: TimezoneEnum): GetTodayInfoOutput;
}

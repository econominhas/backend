import type { TimezoneEnum } from '@prisma/client';

export interface GetTodayInfoOutput {
	day: number;
	month: number;
	year: number;
}

export abstract class DateAdapter {
	abstract getTodayInfo(timezone: TimezoneEnum): GetTodayInfoOutput;
}

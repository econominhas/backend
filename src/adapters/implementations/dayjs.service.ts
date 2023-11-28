import { Injectable } from '@nestjs/common';
import type { GetTodayInfoOutput } from '../date';
import { DateAdapter } from '../date';
import type { TimezoneEnum } from '@prisma/client';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class DayjsAdapter extends DateAdapter {
	constructor() {
		super();
	}

	getTodayInfo(timezone: TimezoneEnum): GetTodayInfoOutput {
		const today = dayjs.tz(this.tz(timezone));

		return {
			day: today.date(),
			month: today.month() + 1,
			year: today.year(),
		};
	}

	// Private

	private tz(tz: TimezoneEnum) {
		return tz.replace('America', 'America/');
	}
}

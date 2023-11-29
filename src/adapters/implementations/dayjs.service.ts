import { Injectable } from '@nestjs/common';
import type { GetTodayInfoOutput } from '../date';
import { DateAdapter } from '../date';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import type { TimezoneEnum } from 'src/types/enums';

dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class DayjsAdapter extends DateAdapter {
	constructor() {
		super();
	}

	getTodayInfo(timezone?: TimezoneEnum): GetTodayInfoOutput {
		const today = dayjs.tz(timezone);

		return {
			day: today.date(),
			month: today.month() + 1,
			year: today.year(),
		};
	}
}

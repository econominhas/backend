import { Injectable } from '@nestjs/common';
import type { DateManipulationUnit, GetTodayInfoOutput } from '../../date';
import { DateAdapter } from '../../date';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import type { TimezoneEnum } from 'types/enums';

dayjs.extend(utc);
dayjs.extend(timezone);

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
}

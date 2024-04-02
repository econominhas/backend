import { Injectable } from "@nestjs/common";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import dayjsTz from "dayjs/plugin/timezone";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

import { type TimezoneEnum } from "types/enums/timezone";

import {
	DateAdapter,
	type DateUnit,
	type WeekDays,
	type TodayOutput,
} from "../../date";

dayjs.extend(utc);
dayjs.extend(dayjsTz);
dayjs.extend(isSameOrAfter);

dayjs.tz.setDefault("UTC");

@Injectable()
export class DayjsAdapterService extends DateAdapter {
	private readonly weekDays: Array<WeekDays> = [
		"sunday",
		"monday",
		"tuesday",
		"wednesday",
		"thursday",
		"friday",
		"saturday",
	];

	/**
	 *
	 * Info
	 *
	 */

	today(timezone?: TimezoneEnum): TodayOutput {
		const today = dayjs.tz(timezone);

		return {
			day: today.date(),
			month: today.month() + 1,
			year: today.year(),
			date: today.toDate(),
		};
	}

	newDate(date?: Date | string, timezone?: TimezoneEnum): Date {
		return dayjs.tz(date, timezone).toDate();
	}

	get(date: Date | string, unit: DateUnit): number {
		if (unit === "day") {
			return dayjs.tz(date).get("date");
		}

		if (unit === "month") {
			return dayjs.tz(date).get(unit) + 1;
		}

		return dayjs.tz(date).get(unit);
	}

	diff(
		startDate: Date | string,
		endDate: Date | string,
		unit: DateUnit,
	): number {
		return dayjs(endDate).diff(startDate, unit, true);
	}

	getDayOfWeek(date: Date | string): WeekDays {
		return this.weekDays[dayjs(date).get("day")];
	}

	getNextMonths(startDate: Date | string, amount: number): Array<Date> {
		const months: Array<Date> = [];

		let curDate = dayjs.tz(startDate);
		do {
			months.push(curDate.toDate());

			curDate = curDate.add(1, "month");
		} while (months.length < amount);

		return months;
	}

	format(date: Date | string): string {
		return dayjs.tz(date).format("YYYY-MM-DD");
	}

	statementDate(
		dueDay: number,
		statementDays: number,
		monthsToAdd?: number,
	): Date {
		let date = dayjs.tz();

		if (monthsToAdd) {
			date = date.add(monthsToAdd, "months");
		}

		return date
			.set("date", dueDay)
			.startOf("day")
			.subtract(statementDays, "days")
			.toDate();
	}

	dueDate(dueDay: number, monthsToAdd: number = 0): Date {
		let date = dayjs.tz();

		if (monthsToAdd) {
			date = date.add(monthsToAdd, "months");
		}

		return date.set("date", dueDay).startOf("day").toDate();
	}

	/**
	 *
	 * Comparison
	 *
	 */

	isSameMonth(date: Date | string, anotherDate: Date | string): boolean {
		const d1 = dayjs.tz(date);
		const d2 = dayjs.tz(anotherDate);

		const d1Month = d1.get("month");
		const d1Year = d1.get("year");
		const d2Month = d2.get("month");
		const d2Year = d2.get("year");

		const isSameYear = d1Year === d2Year;
		const isSameMonth = d1Month === d2Month;

		return isSameYear && isSameMonth;
	}

	isAfterToday(date: Date | string): boolean {
		return dayjs.tz(date).isAfter(dayjs.tz());
	}

	/**
	 *
	 * Modifiers
	 *
	 */

	nowPlus(amount: number, unit: DateUnit): Date {
		return dayjs.tz().add(amount, unit).toDate();
	}

	setDay(date: Date | string, amount: number): Date {
		return dayjs(date).set("date", amount).toDate();
	}

	add(date: Date | string, amount: number, unit: DateUnit): Date {
		if (unit === "month") {
			const dateDate = this.newDate(date);

			const day = this.get(dateDate, "day");

			if (day > 28) {
				const year = this.get(dateDate, "year");
				const month = this.get(dateDate, "month");

				const result = dayjs
					.tz(`${year}-${month}-28`)
					.add(amount, unit)
					.toDate();
				const resultEndOfMonth = this.startOf(
					this.endOf(result, "month"),
					"day",
				);
				const lastDayOfMonth = this.get(resultEndOfMonth, "day");

				/*
				 * If the expected day exceeds the last day of the month,
				 * returns the last day of the month
				 */
				if (day > lastDayOfMonth) {
					return resultEndOfMonth;
				}

				return this.newDate(
					[this.get(result, "year"), this.get(result, "month"), day].join("-"),
				);
			}

			return dayjs.tz(date).add(amount, unit).set("date", day).toDate();
		}

		return dayjs.tz(date).add(amount, unit).toDate();
	}

	sub(date: Date | string, amount: number, unit: DateUnit): Date {
		const dateDate = this.newDate(date);

		const day = this.get(dateDate, "day");

		if (day > 28) {
			const year = this.get(dateDate, "year");
			const month = this.get(dateDate, "month");

			const result = this.add(`${year}-${month}-28`, amount * -1, unit);
			const resultEndOfMonth = this.startOf(this.endOf(result, "month"), "day");
			const lastDayOfMonth = this.get(resultEndOfMonth, "day");

			/*
			 * If the expected day exceeds the last day of the month,
			 * returns the last day of the month
			 */
			if (day > lastDayOfMonth) {
				return resultEndOfMonth;
			}

			return this.newDate(
				[this.get(result, "year"), this.get(result, "month"), day].join("-"),
			);
		}

		return this.add(date, amount * -1, unit);
	}

	startOf(date: Date | string, unit: DateUnit, timezone?: TimezoneEnum): Date {
		return dayjs.tz(date, timezone).startOf(unit).toDate();
	}

	endOf(date: Date | string, unit: DateUnit, timezone?: TimezoneEnum): Date {
		return dayjs.tz(date, timezone).endOf(unit).toDate();
	}
}

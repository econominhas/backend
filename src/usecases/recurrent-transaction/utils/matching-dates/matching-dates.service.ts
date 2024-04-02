import { Inject, Injectable } from "@nestjs/common";
import {
	RecurrenceCreateEnum,
	RecurrenceExcludeEnum,
	RecurrenceTryAgainEnum,
} from "@prisma/client";

import { DateAdapter, type WeekDays } from "adapters/date";
import { DayjsAdapterService } from "adapters/implementations/dayjs/dayjs.service";

interface GetDatesInput {
	cCreates: Array<RecurrenceCreateEnum>;
	cExcludes: Array<RecurrenceExcludeEnum>;
	cTryAgains: Array<RecurrenceTryAgainEnum>;
}

interface DatesFound {
	valid: boolean;
	cCreates: RecurrenceCreateEnum;
	date: Date;
	invalidBecause?: string;
	replaceBy?: Date; // If invalid but found alternative
}

interface GetMatchingDatesInput {
	date: Date;
	cCreates: Array<RecurrenceCreateEnum>;
}

interface FilterDatesInput {
	matchingDates: Array<DatesFound>;
	cExcludes: Array<RecurrenceExcludeEnum>;
	cTryAgains: Array<RecurrenceTryAgainEnum>;
}

interface FindAlternativeInput {
	date: Date;
	cExcludes: Array<RecurrenceExcludeEnum>;
	cTryAgains: Array<RecurrenceTryAgainEnum>;
}

const HOLIDAYS = [
	"2024-01-01", // Ano Novo
	"2024-02-12", // Carnaval
	"2024-02-13", // Carnaval
	"2024-02-14", // Carnaval
	"2024-03-29", // Sexta-Feira Santa
	"2024-04-21", // Dia de Tiradentes
	"2024-05-01", // Dia do Trabalho
	"2024-05-30", // Corpus Christi
	"2024-09-07", // Independência do Brasil
	"2024-10-12", // Nossa Senhora Aparecida
	"2024-10-15", // Dia do Professor
	"2024-10-28", // Dia do Servidor Público
	"2024-11-02", // Dia de Finados
	"2024-11-15", // Proclamação da República
	"2024-12-25", // Natal
];

@Injectable()
export class MatchingDates {
	constructor(
		@Inject(DayjsAdapterService)
		private readonly dateAdapter: DateAdapter,
	) {}

	getDates({ cCreates, cExcludes, cTryAgains }: GetDatesInput) {
		const matchingDates = this.getMatchingDates({
			date: this.dateAdapter.newDate(),
			cCreates,
		});

		const filteredDates = this.filterDates({
			matchingDates,
			cExcludes,
			cTryAgains,
		});

		return filteredDates
			.map(({ valid, date, replaceBy }) =>
				valid ? replaceBy || date : undefined,
			)
			.filter(Boolean);
	}

	/**
	 * @private
	 */
	getMatchingDates({
		date,
		cCreates,
	}: GetMatchingDatesInput): Array<DatesFound> {
		const startOfTheMonth = this.dateAdapter.startOf(date, "month");

		return cCreates.map(param => {
			if (param === RecurrenceCreateEnum.FIFTH_BUSINESS_DAY) {
				/**
				 * Days to add to get to the fifth business day,
				 * if the month start at the following week days
				 */
				const daysToAdd: Record<WeekDays, number> = {
					sunday: 5,
					monday: 4,
					tuesday: 6,
					wednesday: 6,
					thursday: 6,
					friday: 6,
					saturday: 6,
				};

				const fifthBusinessDay = this.dateAdapter.add(
					startOfTheMonth,
					daysToAdd[this.dateAdapter.getDayOfWeek(date)],
					"day",
				);

				return {
					valid: true,
					cCreates: param,
					date: fifthBusinessDay,
				};
			}

			if (param === RecurrenceCreateEnum.FIRST_DAY_OF_MONTH) {
				return {
					valid: true,
					cCreates: param,
					date: startOfTheMonth,
				};
			}

			if (param === RecurrenceCreateEnum.LAST_DAY_OF_MONTH) {
				return {
					valid: true,
					cCreates: param,
					date: this.dateAdapter.startOf(
						this.dateAdapter.endOf(startOfTheMonth, "month"),
						"day",
					),
				};
			}

			if (/^DAY_[\d]{1,2}$/.test(param)) {
				const day = parseInt(param.replace("DAY_", ""));

				return {
					valid: true,
					cCreates: param,
					date: this.dateAdapter.setDay(startOfTheMonth, day),
				};
			}

			if (/^DAY_[\d]{1,2}_OR_LAST_DAY_OF_MONTH$/.test(param)) {
				const day = parseInt(param.replace("DAY_", ""));

				return {
					valid: true,
					cCreates: param,
					date: this.dateAdapter.setDay(startOfTheMonth, day),
				};
			}
		});
	}

	/**
	 * @private
	 */
	filterDates({
		matchingDates,
		cExcludes,
		cTryAgains,
	}: FilterDatesInput): Array<DatesFound> {
		return matchingDates.map(dateData => {
			if (this.isDateValid(dateData.date, cExcludes)) {
				return {
					...dateData,
					valid: true,
				};
			}

			const alternativeDate = cTryAgains.reduce<Date | undefined>(
				(acc, cur) => {
					if (acc) {
						return acc;
					}

					if (cur === RecurrenceTryAgainEnum.IF_NOT_BEFORE) {
						return this.ifNotBefore(dateData.date, cExcludes);
					}

					if (cur === RecurrenceTryAgainEnum.IF_NOT_AFTER) {
						return this.ifNotAfter(dateData.date, cExcludes);
					}
				},
				undefined,
			);

			return {
				...dateData,
				replaceBy: alternativeDate,
				valid: Boolean(alternativeDate),
			};
		});
	}

	/**
	 * @private
	 */
	isDateValid(date: Date, conditions: Array<RecurrenceExcludeEnum>) {
		return conditions.every(condition => {
			if (condition === RecurrenceExcludeEnum.IN_BUSINESS_DAY) {
				const weekDay = this.dateAdapter.getDayOfWeek(date);

				return !["sunday", "saturday"].includes(weekDay);
			}

			if (condition === RecurrenceExcludeEnum.IN_WEEKEND) {
				const weekDay = this.dateAdapter.getDayOfWeek(date);

				return ["sunday", "saturday"].includes(weekDay);
			}

			if (condition === RecurrenceExcludeEnum.IN_HOLIDAY) {
				return this.isHoliday(date);
			}

			if (condition === RecurrenceExcludeEnum.NOT_IN_HOLIDAY) {
				return !this.isHoliday(date);
			}
		});
	}

	/**
	 * @private
	 */
	findAlternative({ date, cTryAgains, cExcludes }: FindAlternativeInput) {
		return cTryAgains.reduce<Date | undefined>((acc, cur) => {
			if (acc) {
				return acc;
			}

			if (cur === RecurrenceTryAgainEnum.IF_NOT_BEFORE) {
				return this.ifNotBefore(date, cExcludes);
			}

			if (cur === RecurrenceTryAgainEnum.IF_NOT_AFTER) {
				return this.ifNotAfter(date, cExcludes);
			}
		}, undefined);
	}

	/**
	 * @private
	 */
	ifNotBefore(
		date: Date,
		conditions: Array<RecurrenceExcludeEnum>,
	): Date | undefined {
		const month = this.dateAdapter.get(date, "month");
		let curDate = date;

		while (this.dateAdapter.get(curDate, "month") === month) {
			curDate = this.dateAdapter.sub(curDate, 1, "day");

			if (this.isDateValid(curDate, conditions)) {
				return curDate;
			}
		}
	}

	/**
	 * @private
	 */
	ifNotAfter(
		date: Date,
		conditions: Array<RecurrenceExcludeEnum>,
	): Date | undefined {
		const month = this.dateAdapter.get(date, "month");
		let curDate = date;

		while (this.dateAdapter.get(curDate, "month") === month) {
			curDate = this.dateAdapter.add(curDate, 1, "day");

			if (this.isDateValid(curDate, conditions)) {
				return curDate;
			}
		}
	}

	/**
	 * @private
	 */
	isHoliday(date: Date): boolean {
		return HOLIDAYS.includes(this.dateAdapter.format(date));
	}
}

import {
	Inject,
	Injectable,
	InternalServerErrorException,
} from "@nestjs/common";
import { RecurrenceFormulaEnum } from "@prisma/client";

import { DateAdapter, type DateUnit } from "adapters/date";
import { DayjsAdapterService } from "adapters/implementations/dayjs/dayjs.service";

interface CalcAmountInput {
	formulaToUse: RecurrenceFormulaEnum;
	amount: number;
	startAt?: Date;
}

interface FormulaRawAmountInput {
	baseAmount: number;
}

interface FormulaPMGInput {
	baseAmount: number;
	startAt: Date;
	gapAmount: number;
	gapUnit: DateUnit | "week";
}

@Injectable()
export class Formulas {
	constructor(
		@Inject(DayjsAdapterService)
		private readonly dateAdapter: DateAdapter,
	) {}

	calcAmount({ formulaToUse, amount, startAt }: CalcAmountInput) {
		if (formulaToUse === RecurrenceFormulaEnum.RAW_AMOUNT) {
			return this.formulaRawAmount({
				baseAmount: amount,
			});
		}

		if (formulaToUse === RecurrenceFormulaEnum.PM_1WG) {
			if (!startAt) {
				throw new InternalServerErrorException(
					`Formula "${formulaToUse}" requires startAt`,
				);
			}

			return this.formulaPMG({
				baseAmount: amount,
				startAt,
				gapAmount: 1,
				gapUnit: "week",
			});
		}

		if (formulaToUse === RecurrenceFormulaEnum.PM_2WG) {
			if (!startAt) {
				throw new InternalServerErrorException(
					`Formula "${formulaToUse}" requires startAt`,
				);
			}

			return this.formulaPMG({
				baseAmount: amount,
				startAt,
				gapAmount: 2,
				gapUnit: "week",
			});
		}

		throw new InternalServerErrorException(
			`Formula "${formulaToUse}" not implemented`,
		);
	}

	/**
	 * @private
	 */
	formulaRawAmount({ baseAmount }: FormulaRawAmountInput): number {
		return baseAmount;
	}

	/**
	 * @private
	 */
	formulaPMG({
		baseAmount,
		startAt,
		gapAmount,
		gapUnit,
	}: FormulaPMGInput): number {
		const prevMonth = this.dateAdapter.startOf(
			this.dateAdapter.sub(this.dateAdapter.newDate(), 1, "month"),
			"month",
		);
		const diff = Math.ceil(this.dateAdapter.diff(startAt, prevMonth, "month"));
		const firstDay = this.dateAdapter.add(startAt, diff, "month");

		const startOfCurMonthTime = this.dateAdapter
			.startOf(this.dateAdapter.newDate(), "month")
			.getTime();

		let amountOfDays = 0;
		let curDate = firstDay;
		while (curDate.getTime() < startOfCurMonthTime) {
			amountOfDays++;

			curDate = this.dateAdapter.add(curDate, gapAmount, gapUnit);
		}

		return baseAmount * amountOfDays;
	}
}

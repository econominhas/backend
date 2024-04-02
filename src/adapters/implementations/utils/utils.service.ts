import { Injectable } from "@nestjs/common";

import {
	UtilsAdapter,
	type PaginationInput,
	type PaginationOutput,
} from "../../utils";

@Injectable()
export class UtilsAdapterService extends UtilsAdapter {
	pagination({
		page: originalPage,
		limit: originalLimit,
	}: PaginationInput): PaginationOutput {
		const page = originalPage || 1;
		const limit = originalLimit || 15;

		return {
			paging: {
				curPage: page,
				nextPage: page + 1,
				prevPage: page === 1 ? undefined : page - 1,
				limit,
			},
			limit,
			offset: (page - 1) * limit,
		};
	}

	formatMoney(valueNumber: number): string {
		const value = valueNumber.toString();

		const decimalsStart = value.length - 2;

		const formatter = new Intl.NumberFormat("pt-BR", {
			style: "currency",
			currency: "BRL",
		});

		const integer = value.length >= 2 ? value.substring(0, decimalsStart) : "0";
		const cents = value.length >= 2 ? value.substring(decimalsStart) : value;

		return formatter
			.format(parseFloat([integer, ".", cents.padStart(2, "0")].join("")))
			.replaceAll(" ", " ");
	}
}

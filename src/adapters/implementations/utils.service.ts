import { Injectable } from '@nestjs/common';
import { UtilsAdapter } from '../utils';
import type { PaginationInput, PaginationOutput } from '../utils';

@Injectable()
export class UtilsAdapterImplementation extends UtilsAdapter {
	constructor() {
		super();
	}

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

		const formatter = new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL',
		});

		return formatter.format(
			parseFloat(
				[
					value.substring(0, decimalsStart),
					'.',
					value.substring(decimalsStart),
				].join(''),
			),
		);
	}
}

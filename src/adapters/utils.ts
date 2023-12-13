import type { PaginatedItems } from 'types/paginated-items';

export interface PaginationInput {
	page?: number;
	limit?: number;
}

export interface PaginationOutput {
	paging: PaginatedItems<any>['paging'];
	offset: number;
	limit: number;
}

export abstract class UtilsAdapter {
	abstract pagination(i: PaginationInput): PaginationOutput;

	abstract formatMoney(i: number): string;
}

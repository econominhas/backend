import type { PaginatedItems } from 'src/types/paginated-items';

export interface PaginationInput {
	page?: number;
	limit?: number;
}

export interface PaginationOutput {
	paging: PaginatedItems<any>['paging'];
	offset: number;
	limit: number;
}

export interface UtilsAdapter {
	pagination: (i: PaginationInput) => PaginationOutput;

	formatMoney: (i: number) => string;
}

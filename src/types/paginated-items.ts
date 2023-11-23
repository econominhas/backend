export interface Paginated {
	page?: number;
	limit?: number;
}

export interface PaginatedItems<T> {
	paging: {
		curPage: number;
		nextPage: number;
		prevPage?: number;
		limit: number;
	};
	data: Array<T>;
}

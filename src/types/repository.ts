export type OrderBy<T> = Partial<Record<keyof T, "asc" | "desc">>;

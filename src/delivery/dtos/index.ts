import { Transform } from "class-transformer";
import { IsOptional, IsInt, Min, Max } from "class-validator";

import { IsID } from "../validators/internal";

export class PaginatedDto {
	@IsOptional()
	@IsInt()
	@Min(1)
	@Max(100)
	@Transform(({ value }) => parseFloat(value))
	page?: number;

	@IsOptional()
	@IsInt()
	@Min(1)
	@Max(100)
	@Transform(({ value }) => parseFloat(value))
	limit?: number;
}

export class UserDataDto {
	@IsID()
	accountId: string;
}

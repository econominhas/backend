import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { IsID } from '../validators/internal';

export class PaginatedDto {
	@IsOptional()
	@IsInt()
	@Min(1)
	@Max(100)
	page?: number;

	@IsOptional()
	@IsInt()
	@Min(1)
	@Max(100)
	limit?: number;
}

export class UserDataDto {
	@IsID()
	accountId: string;
}

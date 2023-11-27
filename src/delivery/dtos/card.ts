import {
	IsInt,
	IsNumberString,
	IsOptional,
	Max,
	MaxLength,
	Min,
	MinLength,
} from 'class-validator';
import { IsID, IsName } from '../validators/internal';

export class CreateDto {
	@IsID()
	cardProviderId: string;

	@IsName()
	name: string;

	@IsNumberString()
	@MinLength(4)
	@MaxLength(4)
	lastFourDigits: string;

	@IsOptional()
	@IsInt()
	@Min(1)
	@Max(31)
	dueDay?: number;

	@IsOptional()
	@IsInt()
	@Min(0)
	@Max(999_999_999_99)
	limit?: number;

	@IsOptional()
	@IsInt()
	@Min(0)
	@Max(999_999_999_99)
	balance?: number;
}

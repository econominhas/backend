import {
	IsInt,
	IsNumberString,
	Max,
	MaxLength,
	Min,
	MinLength,
} from 'class-validator';
import { IsID, IsName } from '../validators/internal';

export class CreateDto {
	@IsName()
	name: string;

	@IsID()
	bankProviderId: string;

	@IsNumberString()
	@MinLength(6)
	@MaxLength(6)
	accountNumber: string;

	@IsNumberString()
	@MinLength(3)
	@MaxLength(3)
	branch: string;

	@IsInt()
	@Min(0)
	@Max(999_999_999_99)
	balance: number;
}

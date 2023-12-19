import {
	ArrayMaxSize,
	ArrayMinSize,
	IsArray,
	ValidateNested,
} from 'class-validator';
import { IsAmount, IsDescription, IsID, IsName } from '../validators/internal';
import { Type } from 'class-transformer';
import { IsMonth, IsYear } from '../validators/date';

class CreateItem {
	@IsID()
	categoryId: string;

	@IsAmount()
	amount: number;
}

class CreateDate {
	@IsMonth()
	month: number;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateItem)
	items: Array<CreateItem>;
}

export class CreateDto {
	@IsName()
	name: string;

	@IsDescription()
	description: string;

	@IsYear()
	year: number;

	@IsArray()
	@ValidateNested({ each: true })
	@ArrayMinSize(1)
	@ArrayMaxSize(12)
	@Type(() => CreateDate)
	months: Array<CreateDate>;
}

class CreateBasicItem {
	@IsID()
	categoryId: string;

	@IsAmount()
	amount: number;
}

export class CreateBasicDto {
	@IsName()
	name: string;

	@IsDescription()
	description: string;

	@IsYear()
	year: number;

	@IsArray()
	@ValidateNested({ each: true })
	@ArrayMinSize(1)
	@Type(() => CreateBasicItem)
	items: Array<CreateBasicItem>;
}

export class OverviewDtoDto {
	@IsID()
	budgetId: string;

	@IsMonth()
	month: number;

	@IsYear()
	year: number;
}

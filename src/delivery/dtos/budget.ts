import { Type } from "class-transformer";
import {
	ArrayMaxSize,
	ArrayMinSize,
	IsArray,
	ValidateNested,
} from "class-validator";

import { IsMonth, IsYear } from "../validators/date";
import { IsAmount, IsDescription, IsID, IsName } from "../validators/internal";

class CreateItemItem {
	@IsMonth()
	month: number;

	@IsAmount()
	amount: number;
}

class CreateItem {
	@IsID()
	categoryId: string;

	@IsArray()
	@ValidateNested({ each: true })
	@ArrayMinSize(1)
	@ArrayMaxSize(12)
	@Type(() => CreateItemItem)
	items: Array<CreateItemItem>;
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
	@Type(() => CreateItem)
	items: Array<CreateItem>;
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

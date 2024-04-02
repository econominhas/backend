import { IconEnum } from "@prisma/client";
import { Type } from "class-transformer";
import {
	ArrayMaxSize,
	ArrayMinSize,
	IsArray,
	IsBoolean,
	IsEnum,
	IsHexColor,
	IsOptional,
	ValidateNested,
} from "class-validator";

import { IsDescription, IsName } from "../validators/internal";

import { PaginatedDto } from ".";

class CreateCategoryDto {
	@IsName()
	name: string;

	@IsDescription()
	description: string;

	@IsEnum(IconEnum)
	icon: IconEnum;

	@IsHexColor()
	color: string;
}

export class CreateManyDto {
	@IsArray()
	@ValidateNested({ each: true })
	@ArrayMinSize(1)
	@ArrayMaxSize(50)
	@Type(() => CreateCategoryDto)
	categories: Array<CreateCategoryDto>;
}

export class GetByUserDto extends PaginatedDto {
	@IsOptional()
	@IsBoolean()
	onlyActive?: boolean;
}

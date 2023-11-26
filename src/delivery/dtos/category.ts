import { IconEnum } from '@prisma/client';
import { Type } from 'class-transformer';
import {
	ArrayMaxSize,
	ArrayMinSize,
	IsArray,
	IsEnum,
	IsHexColor,
	IsString,
	MaxLength,
	ValidateNested,
} from 'class-validator';
import { IsName } from '../validators/internal';

class CreateCategoryDto {
	@IsName()
	name: string;

	@IsString()
	@MaxLength(300)
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

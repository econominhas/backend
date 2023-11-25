import { IconEnum } from '@prisma/client';
import {
	IsEnum,
	IsHexColor,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator';

class CreateCategoryDto {
	@IsString()
	@MinLength(1)
	@MaxLength(20)
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
	categories: Array<CreateCategoryDto>;
}

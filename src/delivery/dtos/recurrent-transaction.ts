import { Type } from "class-transformer";
import {
	ArrayMaxSize,
	ArrayMinSize,
	IsArray,
	IsInt,
	Max,
	Min,
	ValidateNested,
} from "class-validator";

import { IsAmount, IsID } from "../validators/internal";

class SalaryInstallment {
	@IsInt()
	@Min(1)
	@Max(31)
	dayOfTheMonth: number;

	@IsInt()
	@Min(1)
	@Max(100)
	percentage: number;
}

export class CreateSalaryDto {
	@IsID()
	bankAccountId: string;

	@IsID()
	budgetId: string;

	@IsID()
	categoryId: string;

	@IsAmount()
	amount: number;

	@IsArray()
	@ValidateNested({ each: true })
	@ArrayMinSize(1)
	@ArrayMaxSize(5)
	@Type(() => SalaryInstallment)
	installments: Array<SalaryInstallment>;
}

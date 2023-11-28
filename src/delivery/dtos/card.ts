import { IsOptional } from "class-validator";

import { IsDay } from "../validators/date";
import { IsAmount, IsID, IsName } from "../validators/internal";
import { IsNumberString } from "../validators/miscellaneous";

export class CreateDto {
	@IsID()
	cardProviderId: string;

	@IsName()
	name: string;

	@IsNumberString(4)
	lastFourDigits: string;

	@IsOptional()
	@IsDay()
	dueDay?: number;

	@IsOptional()
	@IsAmount()
	limit?: number;

	@IsOptional()
	@IsAmount()
	balance?: number;
}

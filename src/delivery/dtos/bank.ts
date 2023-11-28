import { IsAmount, IsID, IsName } from "../validators/internal";
import { IsNumberString } from "../validators/miscellaneous";

export class CreateDto {
	@IsName()
	name: string;

	@IsID()
	bankProviderId: string;

	@IsNumberString(6)
	accountNumber: string;

	@IsNumberString(3)
	branch: string;

	@IsAmount()
	balance: number;
}

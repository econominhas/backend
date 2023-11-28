import { IsName } from "../validators/internal";

export class NameDto {
	@IsName()
	name: string;
}

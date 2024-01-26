import { IsOptional } from 'class-validator';
import { IsName } from '../validators/internal';
import { IsTrue } from 'delivery/validators/miscellaneous';

export class NameDto {
	@IsName()
	name: string;
}

export class UpdateOnboardingDto {
	@IsOptional()
	@IsTrue()
	name?: true;

	@IsOptional()
	@IsTrue()
	categories?: true;

	@IsOptional()
	@IsTrue()
	bankAccounts?: true;

	@IsOptional()
	@IsTrue()
	creditCards?: true;

	@IsOptional()
	@IsTrue()
	budget?: true;

	@IsOptional()
	@IsTrue()
	salary?: true;
}

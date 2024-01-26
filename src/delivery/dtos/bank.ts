import { IsNumberString, Length } from 'class-validator';
import { IsAmount, IsID, IsName } from '../validators/internal';

export class CreateDto {
	@IsName()
	name: string;

	@IsID()
	bankProviderId: string;

	@IsNumberString({ no_symbols: true })
	@Length(6)
	accountNumber: string;

	@IsNumberString({ no_symbols: true })
	@Length(3)
	branch: string;

	@IsAmount()
	balance: number;
}

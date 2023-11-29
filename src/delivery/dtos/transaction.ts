import { IsID } from '../validators/internal';
import { IsMonth, IsYear } from '../validators/date';

export class GetListDto {
	@IsID()
	budgetId: string;

	@IsMonth()
	month: number;

	@IsYear()
	year: number;
}

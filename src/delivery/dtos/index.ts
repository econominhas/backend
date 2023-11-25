import { IsID } from '../validators/internal';

export class UserDataDto {
	@IsID()
	accountId: string;
}

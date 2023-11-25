import { IsSemVer } from 'class-validator';

export class AcceptDto {
	@IsSemVer()
	semVer: string;
}

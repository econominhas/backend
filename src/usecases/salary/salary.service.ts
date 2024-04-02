import { Injectable } from "@nestjs/common";

import { SalaryUseCase, type CreateInput } from "models/salary";

@Injectable()
export class SalaryService extends SalaryUseCase {
	constructor() {
		super();
	}

	async create(_i: CreateInput): Promise<void> {}
}

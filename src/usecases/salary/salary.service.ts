import { Injectable } from '@nestjs/common';
import type { CreateInput } from 'models/salary';
import { SalaryUseCase } from 'models/salary';

@Injectable()
export class SalaryService extends SalaryUseCase {
	constructor() {
		super();
	}

	async create(_i: CreateInput): Promise<void> {}
}

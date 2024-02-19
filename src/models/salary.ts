import type { EmploymentContractTypeEnum } from '@prisma/client';
import type { RtTemplateEnum } from 'types/enums/rt-template';

export interface CreateInput {
	accountId: string;
	employmentContractType: EmploymentContractTypeEnum;
	startAt?: Date;
	salaries: Array<{
		template: RtTemplateEnum;
		baseAmounts: Array<number>;
		days?: Array<number>;
		name: string;
		description: string;
		// Transaction type=IN,OUT,CREDIT
		categoryId?: string;
		// Transaction type=IN,OUT
		bankAccountId?: string;
	}>;
}

export abstract class SalaryUseCase {
	abstract create(i: CreateInput): Promise<void>;
}

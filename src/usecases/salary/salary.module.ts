import { Module } from '@nestjs/common';
import { SalaryService } from './salary.service';

@Module({
	controllers: [],
	imports: [],
	providers: [SalaryService],
	exports: [SalaryService],
})
export class SalaryModule {}

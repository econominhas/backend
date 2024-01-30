import { Module } from '@nestjs/common';
import { Formulas } from './formula.service';
import { DayJsAdapterModule } from 'adapters/implementations/dayjs/dayjs.module';

@Module({
	imports: [DayJsAdapterModule],
	providers: [Formulas],
	exports: [Formulas],
})
export class FormulasModule {}

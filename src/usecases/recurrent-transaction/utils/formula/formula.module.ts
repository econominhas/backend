import { Module } from "@nestjs/common";

import { DayJsAdapterModule } from "adapters/implementations/dayjs/dayjs.module";

import { Formulas } from "./formula.service";

@Module({
	imports: [DayJsAdapterModule],
	providers: [Formulas],
	exports: [Formulas],
})
export class FormulasModule {}

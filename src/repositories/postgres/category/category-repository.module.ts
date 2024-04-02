import { Module } from "@nestjs/common";

import { UIDAdapterModule } from "adapters/implementations/uid/uid.module";

import { PostgresModule } from "..";

import { CategoryRepositoryService } from "./category-repository.service";

@Module({
	imports: [
		PostgresModule.forFeature(["defaultCategory", "category"]),
		UIDAdapterModule,
	],
	providers: [CategoryRepositoryService],
	exports: [CategoryRepositoryService],
})
export class CategoryRepositoryModule {}

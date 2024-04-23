import { Module } from "@nestjs/common";

import { ULIDAdapterModule } from "adapters/implementations/ulid/ulid.module";

import { PostgresModule } from "..";

import { CategoryRepositoryService } from "./category-repository.service";

@Module({
	imports: [
		PostgresModule.forFeature(["defaultCategory", "category"]),
		ULIDAdapterModule,
	],
	providers: [CategoryRepositoryService],
	exports: [CategoryRepositoryService],
})
export class CategoryRepositoryModule {}

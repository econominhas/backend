import { IconEnum } from "@prisma/client";

import { CategoryRepositoryService } from "../../../../src/repositories/postgres/category/category-repository.service";
import { type Mock } from "../../types";
import { type CategoryRepository } from "../../../../src/models/category";

export const makeCategoryRepositoryMock = () => {
	const mock: Mock<CategoryRepository> = {
		createMany: jest.fn(),
		getById: jest.fn(),
		getByUser: jest.fn(),
		getDefault: jest.fn(),
	};

	const outputs = {
		getByUser: {
			activeCategory: [
				{
					id: 1,
					accountId: "accountId1",
					name: "Category A",
					description: "description",
					icon: IconEnum.bank,
					color: "red",
					active: true,
				},
				{
					id: 2,
					accountId: "accountId2",
					name: "Category B",
					description: "description",
					icon: IconEnum.bank,
					color: "red",
					active: true,
				},
				{
					id: 3,
					accountId: "accountId3",
					name: "Category C",
					description: "description",
					icon: IconEnum.bank,
					color: "red",
					active: true,
				},
			],

			inactiveCategory: [
				{
					id: 1,
					accountId: "accountId1",
					name: "Category A",
					description: "description",
					icon: IconEnum.bank,
					color: "red",
					active: false,
				},
				{
					id: 2,
					accountId: "accountId2",
					name: "Category B",
					description: "description",
					icon: IconEnum.bank,
					color: "red",
					active: false,
				},
				{
					id: 3,
					accountId: "accountId3",
					name: "Category C",
					description: "description",
					icon: IconEnum.bank,
					color: "red",
					active: false,
				},
			],
		},
	};

	const module = {
		provide: CategoryRepositoryService,
		useValue: mock,
	};

	return {
		outputs,
		mock,
		module,
	};
};

import { CategoryRepository } from 'models/category';
import type { Mock } from '../../types';
import { CategoryRepositoryService } from 'repositories/postgres/category/category-repository.service';
import { IconEnum } from '@prisma/client';

export const makeCategoryRepositoryMock = () => {
	const mock: Mock<CategoryRepository> = {
		createMany: jest.fn(),
		getById: jest.fn(),
		getByUser: jest.fn(),
		getDefault: jest.fn(),
	};

	const outputs = {
		getByUser: [
			{
				id: '1',
				accountId: 'accountId',
				name: 'name',
				description: 'description',
				icon: IconEnum.bank,
				color: 'red',
				active: true,
			},
		],
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

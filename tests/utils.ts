import { Test } from '@nestjs/testing';
import { POSTGRES_CONNECTION_NAME } from 'repositories/postgres/core';
import { postgresConnectionMock } from './mocks/repositories/postgres/core';
import type { INestApplication, ModuleMetadata } from '@nestjs/common';

export const removeMillis = (date?: Date) => date?.toISOString().split('.')[0];

export const createTestService = <T>(
	service: any,
	{ providers, imports }: ModuleMetadata = {},
): Promise<T> => {
	return Test.createTestingModule({
		providers: [...(providers || []), service as any],
		imports,
	})
		.compile()
		.then((r) => r.get<T>(service));
};

export const createTestModule = (module: any): Promise<INestApplication> => {
	return Test.createTestingModule({
		imports: [module],
	})
		.useMocker((token) => {
			if (token === POSTGRES_CONNECTION_NAME) {
				return postgresConnectionMock;
			}
		})
		.compile()
		.then((r) => r.createNestApplication());
};

import { Test } from "@nestjs/testing";
import { type INestApplication, type ModuleMetadata } from "@nestjs/common";

import { POSTGRES_CONNECTION_NAME } from "../src/repositories/postgres/core";

import { postgresConnectionMock } from "./mocks/repositories/postgres/core";

export const removeMillis = (date?: Date) => date?.toISOString().split(".")[0];

export const createTestService = <T>(
	service: any,
	{ providers, imports }: ModuleMetadata = {},
): Promise<T> =>
	Test.createTestingModule({
		providers: [...(providers || []), service as any],
		imports,
	})
		.compile()
		.then(r => r.get<T>(service));

export const createTestModule = (module: any): Promise<INestApplication> =>
	Test.createTestingModule({
		imports: [module],
	})
		.useMocker(token => {
			if (token === POSTGRES_CONNECTION_NAME) {
				return postgresConnectionMock;
			}
		})
		.compile()
		.then(r => r.createNestApplication());

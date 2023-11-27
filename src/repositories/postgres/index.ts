import type { DynamicModule } from '@nestjs/common';
import { Inject, Module } from '@nestjs/common';
import { PostgresCoreModule } from './core';
import { POSTGRES_CONNECTION_NAME } from './core';
import type { PrismaClient } from '@prisma/client';

type AllTables = Omit<
	PrismaClient,
	| '$connect'
	| '$disconnect'
	| '$executeRaw'
	| '$executeRawUnsafe'
	| '$extends'
	| '$on'
	| '$queryRaw'
	| '$queryRawUnsafe'
	| '$transaction'
	| '$use'
>;

type TablesNames = keyof AllTables;

@Module({})
export class PostgresModule {
	static forRoot(): DynamicModule {
		return {
			module: PostgresModule,
			imports: [PostgresCoreModule.forRoot()],
		};
	}

	static forFeature(tableNames: Array<TablesNames> = []): DynamicModule {
		const providers = tableNames.map((tableName) => ({
			provide: PostgresModule.getRepositoryToken(tableName),
			useFactory: (connection: PrismaClient) => connection[tableName],
			inject: [POSTGRES_CONNECTION_NAME],
		}));

		return {
			module: PostgresModule,
			providers,
			exports: providers,
		};
	}

	static getRepositoryToken(table: TablesNames) {
		return `POSTGRES_${(table as string).toUpperCase()}_REPOSITORY`;
	}
}

export const InjectRepository = (tableName: TablesNames) =>
	Inject(PostgresModule.getRepositoryToken(tableName));

export type Repository<T extends TablesNames> = AllTables[T];

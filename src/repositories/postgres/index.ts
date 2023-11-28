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
			provide: PostgresCoreModule.getRepositoryToken(tableName as string),
			useFactory: (connection: PrismaClient) => connection[tableName],
			inject: [POSTGRES_CONNECTION_NAME],
		}));

		return {
			module: PostgresModule,
			providers,
			exports: providers,
		};
	}

	static raw(): DynamicModule {
		const providers = [
			{
				provide: PostgresCoreModule.getRepositoryToken('RAW'),
				useFactory: (connection: PrismaClient) => connection.$queryRaw,
				inject: [POSTGRES_CONNECTION_NAME],
			},
		];

		return {
			module: PostgresModule,
			providers,
			exports: providers,
		};
	}
}

export const InjectRepository = (tableName: TablesNames) =>
	Inject(PostgresCoreModule.getRepositoryToken(tableName as string));

export const InjectRaw = () =>
	Inject(PostgresCoreModule.getRepositoryToken('RAW'));

export type Repository<T extends TablesNames> = AllTables[T];

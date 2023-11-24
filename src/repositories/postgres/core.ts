import type {
	DynamicModule,
	OnApplicationShutdown,
	Provider,
} from '@nestjs/common';
import { Global, Logger, Module } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';

export const POSTGRES_CONNECTION_NAME = 'POSTGRES_CONNECTION';

@Global()
@Module({})
export class PostgresCoreModule implements OnApplicationShutdown {
	constructor(private readonly moduleRef: ModuleRef) {}

	static forRoot(): DynamicModule {
		const connectionsProviders: Provider = {
			provide: POSTGRES_CONNECTION_NAME,
			useFactory: async () => {
				const connection = new PrismaClient();

				await connection.$connect();

				Logger.log('Connected to postgres!');

				return connection;
			},
		};

		return {
			module: PostgresCoreModule,
			providers: [connectionsProviders],
			exports: [connectionsProviders],
		};
	}

	async onApplicationShutdown() {
		const connection = this.moduleRef.get(
			POSTGRES_CONNECTION_NAME,
		) as PrismaClient;

		try {
			await connection?.$disconnect();
		} catch (e: any) {
			Logger.error(e?.message);
		}
	}
}

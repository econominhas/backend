import { EntityName, MikroOrmModule } from '@mikro-orm/nestjs';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { CustomNamingStrategy } from './naming-strategy';
import { AnyEntity } from '@mikro-orm/core';

export const PostgresModule = MikroOrmModule.forRoot({
	entities: ['./dist/models'], // path to our JS entities (dist), relative to `baseDir`
	entitiesTs: ['./src/models'], // path to our TS entities (src), relative to `baseDir`
	dbName: process.env['DB_NAME'],
	user: process.env['DB_USER'],
	password: process.env['DB_PASSWORD'],
	type: 'postgresql',
	metadataProvider: TsMorphMetadataProvider,
	namingStrategy: CustomNamingStrategy,
	ignoreUndefinedInQuery: true,
});

export const PostgresTable = (entities: EntityName<AnyEntity>[]) =>
	MikroOrmModule.forFeature(entities);

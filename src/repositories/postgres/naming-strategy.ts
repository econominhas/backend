import { NamingStrategy, UnderscoreNamingStrategy } from '@mikro-orm/core';
import { camelCase, pascalCase, snakeCase } from 'change-case';

export class CustomNamingStrategy extends UnderscoreNamingStrategy {
	constructor() {
		super();
	}

	/**
	 * Return a name of the class based on its file name
	 */
	getClassName(file: string, _separator?: string): string {
		return `${pascalCase(file)}Entity`;
	}

	/**
	 * Return a table name for an entity class
	 */
	classToTableName(entityName: string): string {
		return snakeCase(entityName.replace('Entity', ''));
	}

	/**
	 * Return a migration name. This name should allow ordering.
	 */
	classToMigrationName(
		timestamp: string,
		customMigrationName?: string,
	): string {
		return super.classToMigrationName(timestamp, customMigrationName);
	}

	/**
	 * Return a column name for a property
	 */
	propertyToColumnName(propertyName: string): string {
		return snakeCase(propertyName);
	}

	/**
	 * Return a property for a column name (used in `EntityGenerator`).
	 */
	columnNameToProperty(columnName: string): string {
		return camelCase(columnName);
	}

	/**
	 * Return the default reference column name
	 */
	referenceColumnName(): string {
		return super.referenceColumnName();
	}

	/**
	 * Return a join column name for a property
	 */
	joinColumnName(propertyName: string): string {
		return super.joinColumnName(propertyName);
	}

	/**
	 * Return a join table name
	 */
	joinTableName(
		sourceEntity: string,
		targetEntity: string,
		propertyName: string,
	): string {
		return super.joinTableName(sourceEntity, targetEntity, propertyName);
	}

	/**
	 * Return the foreign key column name for the given parameters
	 */
	joinKeyColumnName(entityName: string, referencedColumnName?: string): string {
		return super.joinKeyColumnName(entityName, referencedColumnName);
	}

	/**
	 * Returns key/constraint name for given type. Some drivers might not support all the types (e.g. mysql and sqlite enforce the PK name).
	 */
	indexName(
		tableName: string,
		columns: string[],
		type: 'primary' | 'foreign' | 'unique' | 'index' | 'sequence' | 'check',
	): string {
		return super.indexName(tableName, columns, type);
	}

	/**
	 * Returns alias name for given entity. The alias needs to be unique across the query, which is by default
	 * ensured via appended index parameter. It is optional to use it as long as you ensure it will be unique.
	 */
	aliasName(entityName: string, index: number): string {
		return super.aliasName(entityName, index);
	}
}

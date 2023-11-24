import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import { TimezoneEnum } from 'src/types/enums/timezone';

@Entity()
export class ConfigEntity {
	@PrimaryKey({ type: 'char(16)' })
	id!: string;

	@Property({ type: 'varchar(20)' })
	name!: string;

	@Enum(() => TimezoneEnum)
	timezone!: TimezoneEnum;
}

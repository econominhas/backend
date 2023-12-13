import type { ConfigService } from '@nestjs/config';
import { Transform, plainToInstance } from 'class-transformer';
import {
	IsEmail,
	IsIn,
	IsInt,
	IsOptional,
	IsString,
	validateSync,
} from 'class-validator';
import { IsURL } from './delivery/validators/miscellaneous';

class EnvVars {
	@IsInt()
	@Transform(({ value }) => parseFloat(value))
	PORT: number;

	@IsIn(['dev', 'test', 'production'])
	NODE_ENV: 'dev' | 'test' | 'production';

	@IsOptional()
	@IsURL({ acceptLocalhost: false })
	AWS_ENDPOINT?: string;
	@IsOptional()
	@IsString()
	AWS_ACCESS_KEY_ID: string;
	@IsOptional()
	@IsString()
	AWS_SECRET_ACCESS_KEY: string;
	@IsIn(['us-east-1'])
	AWS_DEFAULT_REGION: string;

	@IsString()
	GOOGLE_CLIENT_ID: string;
	@IsString()
	GOOGLE_CLIENT_SECRET: string;

	@IsString()
	JWT_SECRET: string;

	@IsString()
	DATABASE_URL: string;

	@IsURL({ acceptLocalhost: process.env['NODE_ENV'] === 'dev' })
	API_URL: string;

	@IsEmail()
	NOTIFICATIONS_EMAIL: string;
}

export type AppConfig = ConfigService<EnvVars>;

export function validateConfig(config: Record<string, unknown>) {
	const validatedConfig = plainToInstance(EnvVars, config);
	const errors = validateSync(validatedConfig, {
		skipMissingProperties: false,
	});

	if (errors.length > 0) {
		throw new Error(errors.toString());
	}
	return validatedConfig;
}

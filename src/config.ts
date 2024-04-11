import { Transform, plainToInstance } from "class-transformer";
import {
	IsIn,
	IsInt,
	IsOptional,
	IsString,
	validateSync,
} from "class-validator";
import { type ConfigService } from "@nestjs/config";

import { IsURL } from "./delivery/validators/miscellaneous";

class EnvVars {
	@IsInt()
	@Transform(({ value }) => parseFloat(value))
	PORT: number;

	@IsIn(["dev", "test", "production"])
	NODE_ENV: "dev" | "production" | "test";

	@IsOptional()
	@IsURL({ acceptLocalhost: false })
	AWS_ENDPOINT?: string;

	@IsOptional()
	@IsString()
	AWS_ACCESS_KEY_ID: string;

	@IsOptional()
	@IsString()
	AWS_SECRET_ACCESS_KEY: string;

	@IsIn(["us-east-1"])
	AWS_REGION: string;

	@IsString()
	GOOGLE_CLIENT_ID: string;

	@IsString()
	GOOGLE_CLIENT_SECRET: string;

	@IsString()
	FACEBOOK_CLIENT_ID: string;

	@IsString()
	FACEBOOK_CLIENT_SECRET: string;

	@IsString()
	PASETO_PRIVATE_KEY: string;

	@IsString()
	DATABASE_URL: string;
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

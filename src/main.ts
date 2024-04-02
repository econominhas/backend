import { NestFactory, Reflector } from "@nestjs/core";
import { ValidationPipe, VersioningType } from "@nestjs/common";

import { PasetoAdapterService } from "adapters/implementations/paseto/paseto.service";

import { AppModule } from "./app.module";
import { AuthGuard } from "./delivery/guards/auth.guard";

import "reflect-metadata";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors();

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	);

	app.enableVersioning({
		type: VersioningType.URI,
		defaultVersion: "1", // Current version of the API
	});

	const reflector = app.get(Reflector);
	const tokenAdapter = app.get(PasetoAdapterService);
	app.useGlobalGuards(new AuthGuard(reflector, tokenAdapter));

	app.enableShutdownHooks();

	await app.listen(process.env.PORT);
}
bootstrap();

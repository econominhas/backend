import { ValidationPipe } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";

import { AppModule } from "./app.module";
import { AuthGuard } from "./delivery/guards/auth.guard";
import "reflect-metadata";

const bootstrap = async () => {
	const app = await NestFactory.create(AppModule);

	app.enableCors();

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	);

	const reflector = app.get(Reflector);
	app.useGlobalGuards(new AuthGuard(reflector));

	app.enableShutdownHooks();

	await app.listen(process.env.PORT);
};

bootstrap();

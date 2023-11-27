import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import 'reflect-metadata';
import { AuthGuard } from './delivery/guards/auth.guard';

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

	const reflector = app.get(Reflector);
	app.useGlobalGuards(new AuthGuard(reflector));

	app.enableShutdownHooks();

	await app.listen(process.env['PORT']);
}
bootstrap();

import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';

import { AuthGuard } from './delivery/guards/auth.guard';
import { JWTAdapterService } from './adapters/implementations/jwt/token.service';

import 'reflect-metadata';

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
		defaultVersion: '1', // Current version of the API
	});

	const reflector = app.get(Reflector);
	const tokenAdapter = app.get(JWTAdapterService);
	app.useGlobalGuards(new AuthGuard(reflector, tokenAdapter));

	app.enableShutdownHooks();

	await app.listen(process.env['PORT']);
}
bootstrap();

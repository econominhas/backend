import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { verify } from 'jsonwebtoken';
import { TokenPayload } from 'src/adapters/token';
import { SetMetadata } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.get<boolean>(
			'isPublic',
			context.getHandler(),
		);

		if (isPublic) return true;

		const request = context.switchToHttp().getRequest();

		const [type, token] = request.headers.authorization?.split(' ') ?? [];

		if (type !== 'Bearer' || !token) {
			return false;
		}

		try {
			const payload = verify(token, process.env['JWT_SECRET']!) as TokenPayload;

			const ignoreTermsCheck = this.reflector.get<boolean>(
				'ignoreTermsCheck',
				context.getHandler(),
			);

			if (!ignoreTermsCheck && !payload.terms) {
				return false;
			}
		} catch {
			return false;
		}

		return true;
	}
}

/**
 * Decorator to allow user to use the route
 * even if he isn't logged in
 */
export const Public = () => SetMetadata('isPublic', true);

/**
 * Decorator to allow user to use the route
 * even if he didn't accepted the terms of use
 */
export const IgnoreTermsCheck = () => SetMetadata('ignoreTermsCheck', true);

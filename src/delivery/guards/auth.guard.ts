import { CanActivate, ExecutionContext, Type, mixin } from '@nestjs/common';
import { verify } from 'jsonwebtoken';

export const AuthGuard = (): Type<CanActivate> => {
	class AuthGuardMixin implements CanActivate {
		async canActivate(context: ExecutionContext): Promise<boolean> {
			const request = context.switchToHttp().getRequest();

			const [type, token] = request.headers.authorization?.split(' ') ?? [];

			if (type !== 'Bearer' || !token) {
				return false;
			}

			try {
				verify(token, process.env['JWT_SECRET']!);
			} catch {
				return false;
			}

			return true;
		}
	}

	const guard = mixin(AuthGuardMixin);
	return guard;
};

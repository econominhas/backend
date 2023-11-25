import { CanActivate, ExecutionContext, Type, mixin } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { TokenPayload } from 'src/adapters/token';

interface AuthGuardInput {
	ignoreTermsCheck: boolean;
}

export const AuthGuard = (
	i: AuthGuardInput = {
		ignoreTermsCheck: true,
	},
): Type<CanActivate> => {
	class AuthGuardMixin implements CanActivate {
		async canActivate(context: ExecutionContext): Promise<boolean> {
			const request = context.switchToHttp().getRequest();

			const [type, token] = request.headers.authorization?.split(' ') ?? [];

			if (type !== 'Bearer' || !token) {
				return false;
			}

			try {
				const payload = verify(
					token,
					process.env['JWT_SECRET']!,
				) as TokenPayload;

				if (!i.ignoreTermsCheck && !payload.terms) {
					return false;
				}
			} catch {
				return false;
			}

			return true;
		}
	}

	const guard = mixin(AuthGuardMixin);
	return guard;
};

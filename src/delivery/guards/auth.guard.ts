import {
	Injectable,
	SetMetadata,
	type CanActivate,
	type ExecutionContext,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { TokenAdapter } from "adapters/token";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,

		private readonly tokenAdapter: TokenAdapter,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.get<boolean>(
			"isPublic",
			context.getHandler(),
		);

		if (isPublic) {
			return true;
		}

		const request = context.switchToHttp().getRequest();

		const [type, token] = request.headers.authorization?.split(" ") ?? [];
		if (type !== "Bearer" || !token) {
			return false;
		}
		try {
			const payload = await this.tokenAdapter.validateAccess({
				accessToken: token,
			});

			if (!payload) {
				return false;
			}

			const ignoreTermsCheck = this.reflector.get<boolean>(
				"ignoreTermsCheck",
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
export const Public = () => SetMetadata("isPublic", true);

/**
 * Decorator to allow user to use the route
 * even if he didn't accepted the terms of use
 */
export const IgnoreTermsCheck = () => SetMetadata("ignoreTermsCheck", true);

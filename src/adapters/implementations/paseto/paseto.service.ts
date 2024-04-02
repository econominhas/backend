import { Inject, Injectable } from '@nestjs/common';
import type {
	GenAccessInput,
	GenAccessOutput,
	GenRefreshOutput,
	TokenPayload,
	ValidateAccessInput,
} from '../../token';
import { TokenAdapter } from '../../token';
import type { V4 } from 'paseto';
import { SecretAdapter } from 'adapters/secret';
import { UIDAdapterService } from '../uid/uid.service';
import { AppConfig } from 'config';
import { ConfigService } from '@nestjs/config';
import type { KeyObject } from 'crypto';
import { DateAdapter } from 'adapters/date';
import { DayjsAdapterService } from '../dayjs/dayjs.service';

@Injectable()
export class PasetoAdapterService extends TokenAdapter {
	constructor(
		@Inject('paseto')
		protected readonly paseto: typeof V4,

		@Inject(UIDAdapterService)
		protected readonly secretAdapter: SecretAdapter,
		@Inject(DayjsAdapterService)
		protected readonly dateAdapter: DateAdapter,

		@Inject(ConfigService)
		protected readonly config: AppConfig,
	) {
		super();
	}

	private getSecret(): KeyObject {
		const secretString = this.config.get('PASETO_PRIVATE_KEY');
		const secretBuffer = Buffer.from(secretString, 'base64');
		const secretKeyObject = this.paseto.bytesToKeyObject(secretBuffer);
		return secretKeyObject;
	}

	async genAccess({
		accountId,
		hasAcceptedLatestTerms,
	}: GenAccessInput): Promise<GenAccessOutput> {
		const payload: TokenPayload = {
			sub: accountId,
			terms: hasAcceptedLatestTerms,
			exp: this.dateAdapter.nowPlus(this.expiration, 'minute').toISOString(),
		};

		const secret = this.getSecret();

		const accessToken = await this.paseto.sign(payload as any, secret);

		return {
			accessToken,
			expiresAt: payload.exp,
		};
	}

	async validateAccess({
		accessToken,
	}: ValidateAccessInput): Promise<TokenPayload> {
		try {
			const secret = this.getSecret();

			const payload = (await this.paseto.verify(
				accessToken,
				secret,
			)) as TokenPayload;

			return payload;
		} catch {
			return;
		}
	}

	genRefresh(): GenRefreshOutput {
		return {
			refreshToken: this.secretAdapter.genSuperSecret(),
		};
	}
}

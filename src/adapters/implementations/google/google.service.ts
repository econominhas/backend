import { Inject, Injectable } from '@nestjs/common';
import type {
	ExchangeCodeInput,
	ExchangeCodeOutput,
	GetAuthenticatedUserDataOutput,
} from '../../google';
import { GoogleAdapter } from '../../google';
import { DateAdapter } from 'adapters/date';
import { DayjsAdapterService } from '../dayjs/dayjs.service';
import { AppConfig } from 'config';
import { ConfigService } from '@nestjs/config';

interface ExchangeCodeAPIOutput {
	access_token: string;
	token_type: string;
	expires_in: number;
	refresh_token: string;
	scope: string;
}

interface GetUserDataAPIOutput {
	sub: string; // ID
	given_name: string; // First name
	email: string;
	email_verified: boolean;
}

@Injectable()
export class GoogleAdapterService extends GoogleAdapter {
	constructor(
		@Inject(DayjsAdapterService)
		protected readonly dateAdapter: DateAdapter,

		@Inject(ConfigService)
		protected readonly config: AppConfig,
	) {
		super();
	}

	async exchangeCode({
		code,
		originUrl,
	}: ExchangeCodeInput): Promise<ExchangeCodeOutput> {
		const body = new URLSearchParams();
		body.append('client_id', this.config.get('GOOGLE_CLIENT_ID'));
		body.append('client_secret', this.config.get('GOOGLE_CLIENT_SECRET'));
		body.append('grant_type', 'authorization_code');
		body.append('code', code);
		if (originUrl) {
			body.append('redirect_uri', originUrl);
		}

		const result = await fetch('https://oauth2.googleapis.com/token', {
			method: 'POST',
			body,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Accept: 'application/json',
			},
		})
			.then((r) => r.json())
			.then((r) => r as ExchangeCodeAPIOutput);

		return {
			accessToken: result.access_token,
			refreshToken: result.refresh_token,
			scopes: result.scope.split(' '),
			// eslint-disable-next-line @typescript-eslint/no-magic-numbers
			expiresAt: this.dateAdapter.nowPlus(result.expires_in - 60, 'seconds'),
		};
	}

	async getAuthenticatedUserData(
		accessToken: string,
	): Promise<GetAuthenticatedUserDataOutput> {
		const result = await fetch(
			'https://openidconnect.googleapis.com/v1/userinfo',
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			},
		)
			.then((r) => r.json())
			.then((r) => r as GetUserDataAPIOutput);

		return {
			id: result.sub,
			name: result.given_name,
			email: result.email,
			isEmailVerified: result.email_verified,
		};
	}
}

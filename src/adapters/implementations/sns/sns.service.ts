import { Inject, Injectable } from '@nestjs/common';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { SMS_TEMPLATES, SmsAdapter } from '../../sms';
import type { SendInput } from '../../sms';
import { AppConfig } from 'config';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SNSAdapterService extends SmsAdapter {
	private defaultPlaceholders: Record<string, string>;

	private client: SNSClient;

	constructor(
		@Inject(ConfigService)
		protected config: AppConfig,
	) {
		super();

		this.client = new SNSClient({
			endpoint: this.config.get('AWS_ENDPOINT'),
			region: this.config.get('AWS_REGION'),
			credentials: {
				secretAccessKey: this.config.get('AWS_SECRET_ACCESS_KEY'),
				accessKeyId: this.config.get('AWS_ACCESS_KEY_ID'),
			},
		});

		this.defaultPlaceholders = {};
	}

	async send({
		account,
		to,
		templateId,
		placeholders: placeholdersWithoutDefault,
	}: SendInput) {
		const { body } = SMS_TEMPLATES[templateId];

		const placeholders = {
			accountId: account.id,
			...this.defaultPlaceholders,
			...(placeholdersWithoutDefault || {}),
		};

		await this.client.send(
			new PublishCommand({
				PhoneNumber: to,
				Message: this.applyPlaceholders(body, placeholders),
			}),
		);
	}

	// Private

	private applyPlaceholders(
		text: string,
		placeholders: Record<string, string>,
	) {
		let formattedText = text;

		for (const key in placeholders) {
			const value = placeholders[key];

			formattedText = formattedText.replace(
				new RegExp(`{{${key}}}`, 'g'),
				value,
			);
		}

		return formattedText;
	}
}

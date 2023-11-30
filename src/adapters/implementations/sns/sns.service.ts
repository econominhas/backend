import { Injectable } from '@nestjs/common';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { SMS_TEMPLATES, SmsAdapter } from '../../sms';
import type { SendInput } from '../../sms';

@Injectable()
export class SNSAdapterService extends SmsAdapter {
	private defaultPlaceholders: Record<string, string> = {
		frontEndUrl: process.env['FRONT_URL'],
	};

	private client: SNSClient;

	constructor() {
		super();

		this.client = new SNSClient({
			endpoint: process.env['AWS_ENDPOINT'],
			region: process.env['AWS_DEFAULT_REGION'],
			credentials: {
				secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'],
				accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
			},
		});
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

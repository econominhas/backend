import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { Injectable } from '@nestjs/common';
import type { SendInput } from '../../email';
import { EMAIL_TEMPLATES, EmailAdapter } from '../../email';

@Injectable()
export class SESAdapterService extends EmailAdapter {
	private defaultPlaceholders: Record<string, string> = {
		frontEndUrl: process.env['FRONT_URL'],
	};

	private client: SESClient;

	constructor() {
		super();

		this.client = new SESClient({
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
		const { from, title, body } = EMAIL_TEMPLATES[templateId];

		const placeholders = {
			accountId: account.id,
			...this.defaultPlaceholders,
			...(placeholdersWithoutDefault || {}),
		};

		await this.client.send(
			new SendEmailCommand({
				Source: from,
				Destination: {
					ToAddresses: [to],
				},
				Message: {
					Subject: {
						Data: this.applyPlaceholders(title, placeholders),
						Charset: 'UTF-8',
					},
					Body: {
						Html: {
							Data: this.applyPlaceholders(body, placeholders),
							Charset: 'UTF-8',
						},
					},
				},
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
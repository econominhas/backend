import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { Injectable } from "@nestjs/common";

import { EMAIL_TEMPLATES, type EmailAdapter, type SendInput } from "../email";

@Injectable()
export class SESAdapter implements EmailAdapter {
	private readonly defaultPlaceholders: Record<string, string> = {
		frontEndUrl: process.env.FRONT_URL,
	};

	private readonly client: SESClient;

	constructor() {
		this.client = new SESClient();
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
						Charset: "UTF-8",
					},
					Body: {
						Html: {
							Data: this.applyPlaceholders(body, placeholders),
							Charset: "UTF-8",
						},
					},
				},
			}),
		);
	}

	// Private

	applyPlaceholders(text: string, placeholders: Record<string, string>) {
		let formattedText = text;

		for (const key in placeholders) {
			const value = placeholders[key];

			formattedText = formattedText.replace(
				new RegExp(`{{${key}}}`, "g"),
				value,
			);
		}

		return formattedText;
	}
}

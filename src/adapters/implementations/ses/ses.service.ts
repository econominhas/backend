import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { AppConfig } from "config";

import { EMAIL_TEMPLATES, EmailAdapter, type SendInput } from "../../email";

@Injectable()
export class SESAdapterService extends EmailAdapter {
	private readonly defaultPlaceholders: Record<string, string>;

	private readonly client: SESClient;

	constructor(
		@Inject(ConfigService)
		protected readonly config: AppConfig,
	) {
		super();

		this.client = new SESClient({
			endpoint: this.config.get("AWS_ENDPOINT"),
			region: this.config.get("AWS_REGION"),
			credentials: {
				secretAccessKey: this.config.get("AWS_SECRET_ACCESS_KEY"),
				accessKeyId: this.config.get("AWS_ACCESS_KEY_ID"),
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

	private applyPlaceholders(
		text: string,
		placeholders: Record<string, string>,
	) {
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

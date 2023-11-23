import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { Injectable } from '@nestjs/common';
import { EmailAdapter, SendInput } from '../email';

@Injectable()
export class SESAdapter implements EmailAdapter {
	private client: SESClient;

	constructor() {
		this.client = new SESClient();
	}

	async send({ from, to, title, body }: SendInput) {
		await this.client.send(
			new SendEmailCommand({
				Source: from,
				Destination: {
					ToAddresses: [to],
				},
				Message: {
					Subject: {
						Data: title,
						Charset: 'UTF-8',
					},
					Body: {
						Html: {
							Data: body,
							Charset: 'UTF-8',
						},
					},
				},
			}),
		);
	}
}

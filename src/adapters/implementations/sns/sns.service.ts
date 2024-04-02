import { Inject, Injectable } from "@nestjs/common";
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { ConfigService } from "@nestjs/config";

import { AppConfig } from "config";
import {
	type SendInput,
	type SendSecureInput,
	TopicAdapter,
} from "adapters/topic";
import { IdAdapter } from "adapters/id";

import { UIDAdapterService } from "../uid/uid.service";

@Injectable()
export class SNSAdapterService extends TopicAdapter {
	private readonly client: SNSClient;

	constructor(
		@Inject(ConfigService)
		protected config: AppConfig,

		@Inject(UIDAdapterService)
		private readonly idAdapter: IdAdapter,
	) {
		super();

		this.client = new SNSClient({
			endpoint: this.config.get("AWS_ENDPOINT"),
			region: this.config.get("AWS_REGION"),
			credentials: {
				secretAccessKey: this.config.get("AWS_SECRET_ACCESS_KEY"),
				accessKeyId: this.config.get("AWS_ACCESS_KEY_ID"),
			},
		});
	}

	public async send({ topicName, body }: SendInput) {
		await this.client.send(
			new PublishCommand({
				TopicArn: this.config.get(`TOPIC_ARN_${topicName}` as any),
				Message: JSON.stringify(body),
			}),
		);
	}

	public async sendSecure({ topicName, body, context }: SendSecureInput) {
		await this.client.send(
			new PublishCommand({
				TopicArn: this.config.get(`TOPIC_ARN_${topicName}` as any),
				Message: JSON.stringify(body),
				MessageDeduplicationId: this.idAdapter.genId(),
				MessageGroupId: context,
			}),
		);
	}
}

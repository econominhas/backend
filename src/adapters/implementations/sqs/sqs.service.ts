import { Inject, Injectable } from "@nestjs/common";
import { SqsService } from "@ssut/nestjs-sqs";

import {
	QueueAdapter,
	type SendInput,
	type SendSecureInput,
} from "adapters/queue";
import { IdAdapter } from "adapters/id";

import { UlidAdapterService } from "../ulid/ulid.service";

@Injectable()
export class SQSAdapterService extends QueueAdapter {
	constructor(
		@Inject(UlidAdapterService)
		private readonly idAdapter: IdAdapter,

		private readonly client: SqsService,
	) {
		super();
	}

	async send({ queueName, body, delay }: SendInput): Promise<void> {
		const id = this.idAdapter.genId();

		await this.client.send(queueName, {
			id,
			body,
			delaySeconds: delay,
		});
	}

	async sendSecure({
		queueName,
		body,
		context,
		delay,
	}: SendSecureInput): Promise<void> {
		const id = this.idAdapter.genId();

		await this.client.send(queueName, {
			id,
			body,
			delaySeconds: delay,
			groupId: context,
			deduplicationId: id,
		});
	}
}

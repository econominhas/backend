import { Inject, Injectable } from '@nestjs/common';
import type { SendInput, SendSecureInput } from 'adapters/queue';
import { QueueAdapter } from 'adapters/queue';
import { SqsService } from '@ssut/nestjs-sqs';
import { IdAdapter } from 'adapters/id';
import { UIDAdapterService } from '../uid/uid.service';

@Injectable()
export class SQSAdapterService extends QueueAdapter {
	constructor(
		@Inject(UIDAdapterService)
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

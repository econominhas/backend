import { Module } from '@nestjs/common';
import { UIDAdapterModule } from '../uid/uid.module';
import { SQSAdapterService } from './sqs.service';
import { SqsModule } from '@ssut/nestjs-sqs';
import { ConfigModule } from '@nestjs/config';
import type { AppConfig } from 'config';

export const getQueueProducers = (configService: AppConfig) => {
	const queuesNames: Array<string> = [];
	const region = configService.get('AWS_REGION');

	return {
		producers: queuesNames.map((queueName) => {
			const url = configService.get(`QUEUE_URL_${queueName}` as any);

			if (!url) {
				throw new Error(`Missing env var: "QUEUE_URL_${queueName}"`);
			}

			return {
				name: queueName,
				queueUrl: url,
				region,
			};
		}),
	};
};

@Module({
	imports: [
		UIDAdapterModule,

		SqsModule.registerAsync({
			inject: [ConfigModule],
			useFactory: getQueueProducers,
		}),
	],
	providers: [SQSAdapterService],
	exports: [SQSAdapterService],
})
export class SQSAdapterModule {}

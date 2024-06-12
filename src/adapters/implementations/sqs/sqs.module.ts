import { Module } from "@nestjs/common";
import { SqsModule } from "@ssut/nestjs-sqs";
import { ConfigModule } from "@nestjs/config";

import { type AppConfig } from "config";

import { ULIDAdapterModule } from "../ulid/ulid.module";

import { SQSAdapterService } from "./sqs.service";

export const getQueueProducers = (configService: AppConfig) => {
	const queuesNames: Array<string> = ["foo"];
	const region = configService.get("AWS_REGION");

	return {
		producers: queuesNames.map(queueName => {
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
		ULIDAdapterModule,

		SqsModule.registerAsync({
			inject: [ConfigModule],
			useFactory: getQueueProducers,
		}),
	],
	providers: [SQSAdapterService],
	exports: [SQSAdapterService],
})
export class SQSAdapterModule {}

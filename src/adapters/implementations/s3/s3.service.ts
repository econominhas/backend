import { type Readable } from "stream";

import { Inject, Injectable } from "@nestjs/common";
import {
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";

import { AppConfig } from "config";

import { FileAdapter, type GetInput, type SaveInput } from "../../file";

@Injectable()
export class S3AdapterService extends FileAdapter {
	private readonly client: S3Client;

	constructor(
		@Inject(ConfigService)
		protected readonly config: AppConfig,
	) {
		super();

		this.client = new S3Client({
			endpoint: this.config.get("AWS_ENDPOINT"),
			region: this.config.get("AWS_REGION"),
			credentials: {
				secretAccessKey: this.config.get("AWS_SECRET_ACCESS_KEY"),
				accessKeyId: this.config.get("AWS_ACCESS_KEY_ID"),
			},
			forcePathStyle: this.config.get("NODE_ENV") !== "production",
		});
	}

	async save({ folder, filePath, file, metadata }: SaveInput) {
		await this.client.send(
			new PutObjectCommand({
				Bucket: folder,
				Key: filePath.replace(/^\//, ""),
				Body: file,
				Metadata: metadata,
			}),
		);

		return filePath;
	}

	async getReadStream({ folder, filePath }: GetInput): Promise<Readable> {
		const file = await this.client.send(
			new GetObjectCommand({
				Bucket: folder,
				Key: filePath.replace(/^\//, ""),
			}),
		);

		return file.Body! as Readable;
	}
}

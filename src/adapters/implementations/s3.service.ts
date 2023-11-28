import {
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import type { Readable } from "stream";

import type { FileAdapter, GetInput, SaveInput } from "../file";

@Injectable()
export class S3Adapter implements FileAdapter {
	private readonly client: S3Client;

	constructor() {
		this.client = new S3Client({
			endpoint: process.env.AWS_ENDPOINT,
			region: process.env.AWS_DEFAULT_REGION,
			credentials: {
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
				accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			},
			forcePathStyle: process.env.NODE_ENV !== "production",
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

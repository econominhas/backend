import { type Readable } from "stream";

export interface SaveInput {
	folder: string;
	filePath: `/${string}`;
	file: Buffer;
	metadata?: Record<string, string>;
}

export interface GetInput {
	folder: string;
	filePath: `/${string}`;
}

export abstract class FileAdapter {
	abstract save(i: SaveInput): Promise<string>;

	abstract getReadStream(i: GetInput): Promise<Readable>;
}

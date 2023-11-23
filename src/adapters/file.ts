import { Readable } from 'stream';

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

export interface FileAdapter {
	save: (i: SaveInput) => Promise<string>;

	getReadStream: (i: GetInput) => Promise<Readable>;
}

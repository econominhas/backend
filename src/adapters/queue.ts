export interface SendInput {
	queueName: string;
	body: Record<string, any>;
	delay?: number; // In seconds
}

export interface SendSecureInput {
	queueName: string;
	context: string;
	body: Record<string, any>;
	delay?: number; // In seconds
}

export abstract class QueueAdapter {
	public abstract send(i: SendInput): Promise<void>;

	public abstract sendSecure(i: SendSecureInput): Promise<void>;
}

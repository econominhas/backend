export interface UserCreatedInput {
	topicName: "USER_CREATED";
	body: {
		accountId: string;
	};
}

export type SendInput = UserCreatedInput;

export interface SendSecureInput {
	topicName: string;
	body: Record<string, any>;
	context: string;
}

export abstract class TopicAdapter {
	abstract send(i: SendInput): Promise<void>;

	abstract sendSecure(i: SendSecureInput): Promise<void>;
}

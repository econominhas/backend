export interface SendInput {
	from: string;
	to: string;
	title: string;
	body: string;
}

export interface EmailAdapter {
	send: (i: SendInput) => Promise<void>;
}

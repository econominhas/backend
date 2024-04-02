import { type Account } from "@prisma/client";

export const SMS_TEMPLATES = {
	MAGIC_LINK_LOGIN: {
		body: "",
	},
};

export interface SendInput {
	to: string;
	account: Account;
	templateId: keyof typeof SMS_TEMPLATES;
	placeholders: Record<string, number | string>;
}

export abstract class SmsAdapter {
	abstract send(i: SendInput): Promise<void>;
}

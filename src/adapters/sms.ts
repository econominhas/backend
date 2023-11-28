import type { Account } from "@prisma/client";

export const SMS_TEMPLATES = {
	MAGIC_LINK_LOGIN: {
		from: "",
		title: "",
		body: "",
	},
};

export interface SendInput {
	to: string;
	account: Account;
	templateId: keyof typeof SMS_TEMPLATES;
	placeholders: Record<string, number | string>;
}

export interface SmsAdapter {
	send: (i: SendInput) => Promise<void>;
}

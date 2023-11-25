import { Account } from '@prisma/client';

export interface SendInput {
	to: string;
	account: Account;
	templateId: keyof typeof EMAIL_TEMPLATES;
	placeholders: Record<string, string | number>;
}

export const EMAIL_TEMPLATES = {
	MAGIC_LINK_LOGIN: {
		from: '',
		title: '',
		body: '',
	},
};

export interface EmailAdapter {
	send: (i: SendInput) => Promise<void>;
}

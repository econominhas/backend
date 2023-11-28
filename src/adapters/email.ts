import type { Account } from '@prisma/client';

export const EMAIL_TEMPLATES = {
	MAGIC_LINK_LOGIN: {
		from: '',
		title: '',
		body: '',
	},
};

export interface SendInput {
	to: string;
	account: Account;
	templateId: keyof typeof EMAIL_TEMPLATES;
	placeholders: Record<string, string | number>;
}

export abstract class EmailAdapter {
	abstract send(i: SendInput): Promise<void>;
}

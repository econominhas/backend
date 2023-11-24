import { AccountEntity } from 'src/models/account';

export interface SendInput {
	to: string;
	account: AccountEntity;
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

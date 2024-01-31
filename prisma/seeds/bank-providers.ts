import type { BankProvider as BankProviderPrisma } from '@prisma/client';
import type { PrismaClient } from '@prisma/client';
import { BANKS } from './data/bank-providers/banks';
import { DIGITAL_WALLETS } from './data/bank-providers/digital-wallet';

export type BankProvider = Omit<BankProviderPrisma, 'lastReviewedAt'>;

const PROVIDERS: Array<BankProvider> = [...BANKS, ...DIGITAL_WALLETS];

export const bankProviders = async (prisma: PrismaClient) => {
	const codes = PROVIDERS.map((p) => p.code).filter(Boolean);

	const uniqueCodes = [...new Set(codes)];

	if (uniqueCodes.length !== codes.length) {
		throw new Error('There are duplicated codes in the bank providers');
	}

	await Promise.allSettled(
		PROVIDERS.map(({ id, name, code, iconUrl, color }) =>
			prisma.bankProvider.upsert({
				where: { id },
				update: {},
				create: {
					id,
					name,
					code,
					iconUrl,
					color,
				},
			}),
		),
	);
};

import type { CardProvider as CardProviderPrisma } from '@prisma/client';
import type { PrismaClient } from '@prisma/client';

import { ITAU } from './data/card-providers/credit/itau';
import { BANCO_DO_BRASIL } from './data/card-providers/credit/banco-do-brasil';
import { CAIXA } from './data/card-providers/credit/caixa';
import { INTER } from './data/card-providers/credit/inter';
import { PICPAY } from './data/card-providers/credit/picpay';
import { C6 } from './data/card-providers/credit/c6';
import { ORIGINAL } from './data/card-providers/credit/original';
import { NUBANK } from './data/card-providers/credit/nubank';
import { BRADESCO } from './data/card-providers/credit/bradesco';
import { SANTANDER } from './data/card-providers/credit/santander';
import { BTG } from './data/card-providers/credit/btg';
import { SAFRA } from './data/card-providers/credit/safra';
import { SICOOB } from './data/card-providers/credit/sicoob';
import { VOTORANTIM } from './data/card-providers/credit/votorantim';
import { ALELO } from './data/card-providers/va/alelo';
import { PLUXEE } from './data/card-providers/va/pluxee';
import { TICKET } from './data/card-providers/va/ticket';
import { VR } from './data/card-providers/va/vr';

export type CardProvider = Omit<CardProviderPrisma, 'lastReviewedAt'>;

const PROVIDERS: Array<CardProvider> = [
	// Credit
	...NUBANK,
	...ITAU,
	...BANCO_DO_BRASIL,
	...CAIXA,
	...INTER,
	...PICPAY,
	...C6,
	...ORIGINAL,
	...BRADESCO,
	...SANTANDER,
	...BTG,
	...SAFRA,
	...SICOOB,
	...VOTORANTIM,

	// Benefit
	...ALELO,
	...PLUXEE,
	...TICKET,
	...VR,
];

export const cardProviders = async (prisma: PrismaClient) => {
	await Promise.allSettled(
		PROVIDERS.map(
			({
				id,
				bankProviderId,
				name,
				iconUrl,
				color,
				type,
				network,
				variant,
				statementDays,
			}) =>
				prisma.cardProvider.upsert({
					where: { id },
					update: {},
					create: {
						id,
						name,
						iconUrl,
						color,
						type,
						network,
						variant,
						statementDays,
						bankProvider: {
							connect: {
								id: bankProviderId,
							},
						},
					},
				}),
		),
	);
};

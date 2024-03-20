import { CardTypeEnum, CardNetworkEnum, CardVariantEnum } from '@prisma/client';
import type { CardProvider } from '../../../card-providers';

export const TICKET: Array<CardProvider> = [
	{
		id: '',
		bankProviderId: null,
		name: 'Alimentação',
		iconUrl: '',
		color: '#6E4997',
		type: CardTypeEnum.BENEFIT,
		network: CardNetworkEnum.TICKET,
		variant: CardVariantEnum.VA,
		statementDays: 0,
	},
];

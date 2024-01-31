import { CardTypeEnum, CardNetworkEnum, CardVariantEnum } from '@prisma/client';
import type { CardProvider } from '../../../card-providers';

export const ALELO: Array<CardProvider> = [
	{
		id: 'b16ab8d762ccbcc6',
		bankProviderId: null,
		name: 'Refeição',
		iconUrl: '',
		color: '#BDD654',
		type: CardTypeEnum.BENEFIT,
		network: CardNetworkEnum.ALELO,
		variant: CardVariantEnum.VR,
		statementDays: 0,
	},
	{
		id: '8bd8941195a79040',
		bankProviderId: null,
		name: 'Alimentação',
		iconUrl: '',
		color: '#015A43',
		type: CardTypeEnum.BENEFIT,
		network: CardNetworkEnum.ALELO,
		variant: CardVariantEnum.VA,
		statementDays: 0,
	},
];

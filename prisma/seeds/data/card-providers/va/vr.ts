import { CardTypeEnum, CardNetworkEnum, CardVariantEnum } from '@prisma/client';
import type { CardProvider } from '../../../card-providers';

export const VR: Array<CardProvider> = [
	{
		id: 'b16ab8d762ccbcc6',
		bankProviderId: null,
		name: 'Refeição',
		iconUrl: '',
		color: '#0A802F',
		type: CardTypeEnum.BENEFIT,
		network: CardNetworkEnum.VR,
		variant: CardVariantEnum.VR,
		statementDays: 0,
	},
	{
		id: '8bd8941195a79040',
		bankProviderId: null,
		name: 'Alimentação',
		iconUrl: '',
		color: '#0A802F',
		type: CardTypeEnum.BENEFIT,
		network: CardNetworkEnum.VR,
		variant: CardVariantEnum.VA,
		statementDays: 0,
	},
];

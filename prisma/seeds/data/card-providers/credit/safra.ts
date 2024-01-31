import type { CardProvider } from '../../../card-providers';
import { CardTypeEnum, CardNetworkEnum, CardVariantEnum } from '@prisma/client';

export const SAFRA: Array<CardProvider> = [
	{
		id: '5c3165991ae41c00',
		bankProviderId: '964e9df18f268cc4',
		name: 'Visa Platinum',
		iconUrl: '',
		color: '#00003c',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.VISA,
		variant: CardVariantEnum.PREMIUM,
		statementDays: 7,
	},
	{
		id: 'acc31ef1660ead69',
		bankProviderId: '964e9df18f268cc4',
		name: 'Visa Infinite',
		iconUrl: '',
		color: '#00003c',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.VISA,
		variant: CardVariantEnum.ULTRA_PREMIUM,
		statementDays: 7,
	},
];

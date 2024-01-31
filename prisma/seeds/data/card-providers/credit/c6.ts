import type { CardProvider } from '../../../card-providers';
import { CardTypeEnum, CardNetworkEnum, CardVariantEnum } from '@prisma/client';

export const C6: Array<CardProvider> = [
	{
		id: '83ff3f16cb3c5aa2',
		bankProviderId: '8e8d3c0762eda53c',
		name: 'C6',
		iconUrl: '',
		color: '#000000',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.MASTERCARD,
		variant: CardVariantEnum.ENTRY_LEVEL,
		statementDays: 7,
	},
	{
		id: '23f2c42491e33b32',
		bankProviderId: '8e8d3c0762eda53c',
		name: 'C6 Platinum',
		iconUrl: '',
		color: '#000000',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.MASTERCARD,
		variant: CardVariantEnum.PREMIUM,
		statementDays: 7,
	},
	{
		id: '098e7d2a8912042f',
		bankProviderId: '8e8d3c0762eda53c',
		name: 'C6 Black',
		iconUrl: '',
		color: '#000000',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.MASTERCARD,
		variant: CardVariantEnum.ULTRA_PREMIUM,
		statementDays: 7,
	},
	{
		id: 'c8b7770a17183281',
		bankProviderId: '8e8d3c0762eda53c',
		name: 'C6 Carbon',
		iconUrl: '',
		color: '#000000',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.MASTERCARD,
		variant: CardVariantEnum.ULTRA_PREMIUM,
		statementDays: 7,
	},
];

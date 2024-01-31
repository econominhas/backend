import type { CardProvider } from '../../../card-providers';
import { CardTypeEnum, CardNetworkEnum, CardVariantEnum } from '@prisma/client';

export const INTER: Array<CardProvider> = [
	{
		id: 'ed7b6c0e61e792b0',
		bankProviderId: '6a1bd35be594a1e6',
		name: 'Inter Gold',
		iconUrl: '',
		color: '#ff9d42',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.MASTERCARD,
		variant: CardVariantEnum.MID_MARKET,
		statementDays: 7,
	},
	{
		id: 'aa13ea95124dac1b',
		bankProviderId: '6a1bd35be594a1e6',
		name: 'Inter Platinum',
		iconUrl: '',
		color: '#ff9d42',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.MASTERCARD,
		variant: CardVariantEnum.PREMIUM,
		statementDays: 7,
	},
	{
		id: 'd60434b2648a0d8f',
		bankProviderId: '6a1bd35be594a1e6',
		name: 'Inter Black',
		iconUrl: '',
		color: '#ff9d42',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.MASTERCARD,
		variant: CardVariantEnum.ULTRA_PREMIUM,
		statementDays: 7,
	},
	{
		id: 'a3dc10b36ab2e3f1',
		bankProviderId: '6a1bd35be594a1e6',
		name: 'Inter Win',
		iconUrl: '',
		color: '#ff9d42',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.MASTERCARD,
		variant: CardVariantEnum.ULTRA_PREMIUM,
		statementDays: 7,
	},
];

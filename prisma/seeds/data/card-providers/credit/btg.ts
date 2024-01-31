import type { CardProvider } from '../../../card-providers';
import { CardTypeEnum, CardNetworkEnum, CardVariantEnum } from '@prisma/client';

export const BTG: Array<CardProvider> = [
	{
		id: '178138ca95b415f0',
		bankProviderId: 'c85c33210416e7fd',
		name: 'Opção Avançada',
		iconUrl: '',
		color: '#05132a',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.MASTERCARD,
		variant: CardVariantEnum.PREMIUM,
		statementDays: 7,
	},
	{
		id: '6ba3fe1e8602903c',
		bankProviderId: 'c85c33210416e7fd',
		name: 'Black',
		iconUrl: '',
		color: '#05132a',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.MASTERCARD,
		variant: CardVariantEnum.ULTRA_PREMIUM,
		statementDays: 7,
	},
];

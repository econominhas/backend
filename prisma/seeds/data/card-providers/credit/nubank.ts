import type { CardProvider } from '../../../card-providers';
import { CardTypeEnum, CardNetworkEnum, CardVariantEnum } from '@prisma/client';

export const NUBANK: Array<CardProvider> = [
	{
		id: '94953505a44250e0',
		bankProviderId: '0353c5b72dfd1851',
		name: 'Nubank',
		iconUrl: '',
		color: '#820ad1',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.MASTERCARD,
		variant: CardVariantEnum.ENTRY_LEVEL,
		statementDays: 7,
	},
	{
		id: '',
		bankProviderId: '0353c5b72dfd1851',
		name: 'Nubank Ultravioleta',
		iconUrl: '',
		color: '#290B4D',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.MASTERCARD,
		variant: CardVariantEnum.ULTRA_PREMIUM,
		statementDays: 7,
	},
];

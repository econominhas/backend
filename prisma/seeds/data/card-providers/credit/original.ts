import type { CardProvider } from '../../../card-providers';
import { CardTypeEnum, CardNetworkEnum, CardVariantEnum } from '@prisma/client';

export const ORIGINAL: Array<CardProvider> = [
	{
		id: '483d4eb666d63edc',
		bankProviderId: '454b42246725ba61',
		name: 'Original',
		iconUrl: '',
		color: '#00a857',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.MASTERCARD,
		variant: CardVariantEnum.ENTRY_LEVEL,
		statementDays: 7,
	},
	{
		id: '4f93fe0dd42982f9',
		bankProviderId: '454b42246725ba61',
		name: 'Original Gold',
		iconUrl: '',
		color: '#00a857',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.MASTERCARD,
		variant: CardVariantEnum.MID_MARKET,
		statementDays: 7,
	},
	{
		id: '90ea15210e66bdbd',
		bankProviderId: '454b42246725ba61',
		name: 'Original Platinum',
		iconUrl: '',
		color: '#00a857',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.MASTERCARD,
		variant: CardVariantEnum.PREMIUM,
		statementDays: 7,
	},
	{
		id: 'd074ac64205c9834',
		bankProviderId: '454b42246725ba61',
		name: 'Original Black',
		iconUrl: '',
		color: '#00a857',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.MASTERCARD,
		variant: CardVariantEnum.ULTRA_PREMIUM,
		statementDays: 7,
	},
];

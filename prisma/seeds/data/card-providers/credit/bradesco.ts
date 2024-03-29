import type { CardProvider } from '../../../card-providers';
import { CardTypeEnum, CardNetworkEnum, CardVariantEnum } from '@prisma/client';

export const BRADESCO: Array<CardProvider> = [
	{
		id: 'eed7c96dd219dce1',
		bankProviderId: '219c7ea11698644a',
		name: 'Bradesco Like',
		iconUrl: '',
		color: '#cc092f',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.VISA,
		variant: CardVariantEnum.ENTRY_LEVEL,
		statementDays: 7,
	},

	{
		id: '6c4a294a563a8566',
		bankProviderId: '219c7ea11698644a',
		name: 'Bradesco Elo Mais',
		iconUrl: '',
		color: '#cc092f',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.ELO,
		variant: CardVariantEnum.MID_MARKET,
		statementDays: 7,
	},
	{
		id: '2ba4ab3835336ee0',
		bankProviderId: '219c7ea11698644a',
		name: 'Bradesco Amex Green',
		iconUrl: '',
		color: '#cc092f',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.AMEX,
		variant: CardVariantEnum.MID_MARKET,
		statementDays: 7,
	},

	{
		id: '8d0ba80cbbae956d',
		bankProviderId: '219c7ea11698644a',
		name: 'Bradesco Neo Platinum',
		iconUrl: '',
		color: '#cc092f',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.VISA,
		variant: CardVariantEnum.PREMIUM,
		statementDays: 7,
	},
	{
		id: '1f8f4ca607f33990',
		bankProviderId: '219c7ea11698644a',
		name: 'Bradesco Grafite',
		iconUrl: '',
		color: '#cc092f',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.ELO,
		variant: CardVariantEnum.PREMIUM,
		statementDays: 7,
	},
	{
		id: 'c6f7dfa204e69897',
		bankProviderId: '219c7ea11698644a',
		name: 'Bradesco Amex Gold',
		iconUrl: '',
		color: '#cc092f',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.AMEX,
		variant: CardVariantEnum.PREMIUM,
		statementDays: 7,
	},
	{
		id: 'ad9f955963f61520',
		bankProviderId: '219c7ea11698644a',
		name: 'Bradesco Platinum',
		iconUrl: '',
		color: '#cc092f',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.VISA,
		variant: CardVariantEnum.PREMIUM,
		statementDays: 7,
	},

	{
		id: '831f27494aac24bb',
		bankProviderId: '219c7ea11698644a',
		name: 'Bradesco Signature',
		iconUrl: '',
		color: '#cc092f',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.VISA,
		variant: CardVariantEnum.SUPER_PREMIUM,
		statementDays: 7,
	},

	{
		id: 'b17d44c6e1d9c3c5',
		bankProviderId: '219c7ea11698644a',
		name: 'Bradesco Infinite',
		iconUrl: '',
		color: '#cc092f',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.VISA,
		variant: CardVariantEnum.ULTRA_PREMIUM,
		statementDays: 7,
	},
	{
		id: '4e504741ed6a59e5',
		bankProviderId: '219c7ea11698644a',
		name: 'Bradesco Nanquim',
		iconUrl: '',
		color: '#cc092f',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.ELO,
		variant: CardVariantEnum.ULTRA_PREMIUM,
		statementDays: 7,
	},
	{
		id: 'e4c21f32e05d517f',
		bankProviderId: '219c7ea11698644a',
		name: 'Bradesco Amex Platinum',
		iconUrl: '',
		color: '#cc092f',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.AMEX,
		variant: CardVariantEnum.ULTRA_PREMIUM,
		statementDays: 7,
	},
];

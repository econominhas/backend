import type { CardProvider } from '../../../card-providers';
import { CardTypeEnum, CardNetworkEnum, CardVariantEnum } from '@prisma/client';

export const PICPAY: Array<CardProvider> = [
	{
		id: '990883a69d165215',
		bankProviderId: '96d09014832bbf46',
		name: 'PicPay Gold',
		iconUrl: '',
		color: '#11C76F',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.MASTERCARD,
		variant: CardVariantEnum.MID_MARKET,
		statementDays: 7,
	},
	{
		id: '30f14a0ef74df273',
		bankProviderId: '96d09014832bbf46',
		name: 'PicPay Platinum',
		iconUrl: '',
		color: '#11C76F',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.MASTERCARD,
		variant: CardVariantEnum.PREMIUM,
		statementDays: 7,
	},
	{
		id: 'caf1566a2fd29608',
		bankProviderId: '96d09014832bbf46',
		name: 'PicPay Black',
		iconUrl: '',
		color: '#11C76F',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.MASTERCARD,
		variant: CardVariantEnum.ULTRA_PREMIUM,
		statementDays: 7,
	},
];

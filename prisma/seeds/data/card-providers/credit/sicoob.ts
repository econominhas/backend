import type { CardProvider } from '../../../card-providers';
import { CardTypeEnum, CardNetworkEnum, CardVariantEnum } from '@prisma/client';

export const SICOOB: Array<CardProvider> = [
	// Vooz
	{
		id: '7c8631af63fe0cb9',
		bankProviderId: 'b279e36d7fefd59a',
		name: 'Vooz',
		iconUrl: '',
		color: '#003641',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.VISA,
		variant: CardVariantEnum.ENTRY_LEVEL,
		statementDays: 7,
	},
	// Mastercard
	{
		id: 'd23eb11e77d5db90',
		bankProviderId: 'b279e36d7fefd59a',
		name: 'Mastercard Clássico',
		iconUrl: '',
		color: '#003641',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.MASTERCARD,
		variant: CardVariantEnum.ENTRY_LEVEL,
		statementDays: 7,
	},
	{
		id: '5dea069eed4d39e0',
		bankProviderId: 'b279e36d7fefd59a',
		name: 'Mastercard Gold',
		iconUrl: '',
		color: '#003641',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.MASTERCARD,
		variant: CardVariantEnum.MID_MARKET,
		statementDays: 7,
	},
	{
		id: '2031fe5818858a85',
		bankProviderId: 'b279e36d7fefd59a',
		name: 'Mastercard Platinum',
		iconUrl: '',
		color: '#003641',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.MASTERCARD,
		variant: CardVariantEnum.PREMIUM,
		statementDays: 7,
	},
	{
		id: 'a6b3fa18cc23e358',
		bankProviderId: 'b279e36d7fefd59a',
		name: 'Mastercard Black',
		iconUrl: '',
		color: '#003641',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.MASTERCARD,
		variant: CardVariantEnum.ULTRA_PREMIUM,
		statementDays: 7,
	},
	// Visa
	{
		id: 'fc5bb814b95b57c2',
		bankProviderId: 'b279e36d7fefd59a',
		name: 'Visa Clásico',
		iconUrl: '',
		color: '#003641',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.VISA,
		variant: CardVariantEnum.ENTRY_LEVEL,
		statementDays: 7,
	},
	{
		id: 'c883c9214aa3759b',
		bankProviderId: 'b279e36d7fefd59a',
		name: 'Visa Gold',
		iconUrl: '',
		color: '#003641',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.VISA,
		variant: CardVariantEnum.MID_MARKET,
		statementDays: 7,
	},
	{
		id: 'f57907208dabca17',
		bankProviderId: 'b279e36d7fefd59a',
		name: 'Visa Platinum',
		iconUrl: '',
		color: '#003641',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.VISA,
		variant: CardVariantEnum.PREMIUM,
		statementDays: 7,
	},
	{
		id: '81a956c34ede73cf',
		bankProviderId: 'b279e36d7fefd59a',
		name: 'Visa Infinite',
		iconUrl: '',
		color: '#003641',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.VISA,
		variant: CardVariantEnum.ULTRA_PREMIUM,
		statementDays: 7,
	},
];

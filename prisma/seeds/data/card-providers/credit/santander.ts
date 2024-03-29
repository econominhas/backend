import type { CardProvider } from '../../../card-providers';
import { CardTypeEnum, CardNetworkEnum, CardVariantEnum } from '@prisma/client';

export const SANTANDER: Array<CardProvider> = [
	// GOL Smiles
	{
		id: 'ad68577cef9bfb44',
		bankProviderId: '39a26422a0b1e9d5',
		name: 'GOL Smiles Gold',
		iconUrl: '',
		color: '#c00c00',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.VISA,
		variant: CardVariantEnum.MID_MARKET,
		statementDays: 7,
	},
	{
		id: '4f907e3b46c76abe',
		bankProviderId: '39a26422a0b1e9d5',
		name: 'GOL Smiles Platinum',
		iconUrl: '',
		color: '#c00c00',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.VISA,
		variant: CardVariantEnum.PREMIUM,
		statementDays: 7,
	},
	{
		id: 'e2cfeadee6bade98',
		bankProviderId: '39a26422a0b1e9d5',
		name: 'GOL Smiles Infinite',
		iconUrl: '',
		color: '#c00c00',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.VISA,
		variant: CardVariantEnum.ULTRA_PREMIUM,
		statementDays: 7,
	},
	// Decolar
	{
		id: '6ba4643690688ce8',
		bankProviderId: '39a26422a0b1e9d5',
		name: 'Decolar Gold',
		iconUrl: '',
		color: '#c00c00',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.VISA,
		variant: CardVariantEnum.MID_MARKET,
		statementDays: 7,
	},
	{
		id: '8c0f67c048fda333',
		bankProviderId: '39a26422a0b1e9d5',
		name: 'Decolar Platinum',
		iconUrl: '',
		color: '#c00c00',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.VISA,
		variant: CardVariantEnum.PREMIUM,
		statementDays: 7,
	},
	{
		id: '0c6bdd6677750141',
		bankProviderId: '39a26422a0b1e9d5',
		name: 'Decolar Infinite',
		iconUrl: '',
		color: '#c00c00',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.VISA,
		variant: CardVariantEnum.ULTRA_PREMIUM,
		statementDays: 7,
	},
	// AAdvantage®
	{
		id: '7203ddde1a3155f5',
		bankProviderId: '39a26422a0b1e9d5',
		name: 'AAdvantage Quartz',
		iconUrl: '',
		color: '#c00c00',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.MASTERCARD,
		variant: CardVariantEnum.PREMIUM,
		statementDays: 7,
	},
	{
		id: '30f0f5c27be2a720',
		bankProviderId: '39a26422a0b1e9d5',
		name: 'AAdvantage Platinum',
		iconUrl: '',
		color: '#c00c00',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.MASTERCARD,
		variant: CardVariantEnum.PREMIUM,
		statementDays: 7,
	},
	{
		id: '1323da5595efe45c',
		bankProviderId: '39a26422a0b1e9d5',
		name: 'AAdvantage Black',
		iconUrl: '',
		color: '#c00c00',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.MASTERCARD,
		variant: CardVariantEnum.ULTRA_PREMIUM,
		statementDays: 7,
	},
	// AMEX
	{
		id: 'f783b41b423eb94b',
		bankProviderId: '39a26422a0b1e9d5',
		name: 'Amex Gold',
		iconUrl: '',
		color: '#c00c00',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.AMEX,
		variant: CardVariantEnum.PREMIUM,
		statementDays: 7,
	},
	{
		id: '1d141e8ad613816c',
		bankProviderId: '39a26422a0b1e9d5',
		name: 'Amex Platinum',
		iconUrl: '',
		color: '#c00c00',
		type: CardTypeEnum.CREDIT,
		network: CardNetworkEnum.AMEX,
		variant: CardVariantEnum.ULTRA_PREMIUM,
		statementDays: 7,
	},
];

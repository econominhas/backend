import {
	registerDecorator,
	ValidationOptions,
	ValidationArguments,
} from 'class-validator';
import { isDateYMD } from '@techmmunity/utils';

export function IsDateYYYYMMDD(validationOptions: ValidationOptions = {}) {
	// eslint-disable-next-line @typescript-eslint/ban-types
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: 'isDateYYYYMMDD',
			target: object.constructor,
			propertyName: propertyName,
			constraints: [],
			options: {
				message: `${propertyName} must be a valid birth date`,
				...validationOptions,
			},
			validator: {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				validate(value: any, _args: ValidationArguments) {
					if (typeof value !== 'string') return false;

					return isDateYMD(value);
				},
			},
		});
	};
}

interface IsURLValidationOptions extends ValidationOptions {
	acceptLocalhost: boolean;
}

export function IsURL(validationOptions: IsURLValidationOptions) {
	// eslint-disable-next-line @typescript-eslint/ban-types
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: 'isURL',
			target: object.constructor,
			propertyName: propertyName,
			constraints: [],
			options: {
				message: `${propertyName} must be a valid url`,
				...validationOptions,
			},
			validator: {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				validate(value: any, _args: ValidationArguments) {
					if (typeof value !== 'string') return false;

					if (
						!validationOptions.acceptLocalhost &&
						value.includes('localhost')
					) {
						return false;
					}

					try {
						new URL(value);

						return true;
					} catch (_) {
						return false;
					}
				},
			},
		});
	};
}

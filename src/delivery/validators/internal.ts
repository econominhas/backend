import {
	registerDecorator,
	ValidationOptions,
	ValidationArguments,
} from 'class-validator';

export function IsID(validationOptions: ValidationOptions = {}) {
	// eslint-disable-next-line @typescript-eslint/ban-types
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: 'isID',
			target: object.constructor,
			propertyName: propertyName,
			constraints: [],
			options: {
				message: `${propertyName} must be a valid ID`,
				...validationOptions,
			},
			validator: {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				validate(value: any, _args: ValidationArguments) {
					return typeof value === 'string' && /^[a-z0-9]{16}$/i.test(value);
				},
			},
		});
	};
}

export function IsSecretCode(validationOptions: ValidationOptions = {}) {
	// eslint-disable-next-line @typescript-eslint/ban-types
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: 'isSecretCode',
			target: object.constructor,
			propertyName: propertyName,
			constraints: [],
			options: {
				message: `${propertyName} must be a valid code`,
				...validationOptions,
			},
			validator: {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				validate(value: any, _args: ValidationArguments) {
					return typeof value === 'string' && /^[a-z0-9]{32}$/i.test(value);
				},
			},
		});
	};
}

export function IsHEXColor(validationOptions: ValidationOptions = {}) {
	// eslint-disable-next-line @typescript-eslint/ban-types
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: 'isHEXColor',
			target: object.constructor,
			propertyName: propertyName,
			constraints: [],
			options: {
				message: `${propertyName} must be a valid HEX color`,
				...validationOptions,
			},
			validator: {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				validate(value: any, _args: ValidationArguments) {
					return typeof value === 'string' && /^#[A-Fa-f0-9]{6}$/.test(value);
				},
			},
		});
	};
}

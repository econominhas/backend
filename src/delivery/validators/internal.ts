import type { ValidationArguments } from 'class-validator';
import { registerDecorator } from 'class-validator';

export function IsID() {
	// eslint-disable-next-line @typescript-eslint/ban-types
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: 'isID',
			target: object.constructor,
			propertyName: propertyName,
			constraints: [],
			options: {
				message: `${propertyName} must be a valid ID`,
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

export function IsSecretCode() {
	// eslint-disable-next-line @typescript-eslint/ban-types
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: 'isSecretCode',
			target: object.constructor,
			propertyName: propertyName,
			constraints: [],
			options: {
				message: `${propertyName} must be a valid code`,
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

export function IsName() {
	// eslint-disable-next-line @typescript-eslint/ban-types
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: 'IsName',
			target: object.constructor,
			propertyName: propertyName,
			constraints: [],
			options: {
				message: `${propertyName} must be a valid name`,
			},
			validator: {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				validate(value: any, _args: ValidationArguments) {
					return typeof value === 'string' && /^[\w\W\d\s]{1,20}$/i.test(value);
				},
			},
		});
	};
}

export function IsDescription() {
	// eslint-disable-next-line @typescript-eslint/ban-types
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: 'IsDescription',
			target: object.constructor,
			propertyName: propertyName,
			constraints: [],
			options: {
				message: `${propertyName} must be a valid description`,
			},
			validator: {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				validate(value: any, _args: ValidationArguments) {
					return (
						typeof value === 'string' && /^[\w\W\d\s]{1,300}$/i.test(value)
					);
				},
			},
		});
	};
}

export function IsTransactionName() {
	// eslint-disable-next-line @typescript-eslint/ban-types
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: 'IsName',
			target: object.constructor,
			propertyName: propertyName,
			constraints: [],
			options: {
				message: `${propertyName} must be a valid transaction name`,
			},
			validator: {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				validate(value: any, _args: ValidationArguments) {
					return typeof value === 'string' && /^[\w\W\d\s]{1,30}$/i.test(value);
				},
			},
		});
	};
}

export function IsAmount() {
	// eslint-disable-next-line @typescript-eslint/ban-types
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: 'IsAmount',
			target: object.constructor,
			propertyName: propertyName,
			constraints: [],
			options: {
				message: `${propertyName} must be a valid amount`,
			},
			validator: {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				validate(value: any, _args: ValidationArguments) {
					return (
						typeof value === 'number' &&
						Number.isInteger(value) &&
						value >= 0 &&
						value <= 999_999_999_99
					);
				},
			},
		});
	};
}

export function IsHEXColor() {
	// eslint-disable-next-line @typescript-eslint/ban-types
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: 'isHEXColor',
			target: object.constructor,
			propertyName: propertyName,
			constraints: [],
			options: {
				message: `${propertyName} must be a valid HEX color`,
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

import { registerDecorator, type ValidationArguments } from "class-validator";

export function IsID() {
	return function (object: object, propertyName: string) {
		registerDecorator({
			name: "isID",
			target: object.constructor,
			propertyName,
			constraints: [],
			options: {
				message: `${propertyName} must be a valid ID`,
			},
			validator: {
				validate(value: any, _args: ValidationArguments) {
					return typeof value === "string" && /^[a-z0-9]{16}$/i.test(value);
				},
			},
		});
	};
}

export function IsSecretCode() {
	return function (object: object, propertyName: string) {
		registerDecorator({
			name: "isSecretCode",
			target: object.constructor,
			propertyName,
			constraints: [],
			options: {
				message: `${propertyName} must be a valid code`,
			},
			validator: {
				validate(value: any, _args: ValidationArguments) {
					return typeof value === "string" && /^[a-z0-9]{32}$/i.test(value);
				},
			},
		});
	};
}

export function IsName() {
	return function (object: object, propertyName: string) {
		registerDecorator({
			name: "IsName",
			target: object.constructor,
			propertyName,
			constraints: [],
			options: {
				message: `${propertyName} must be a valid name`,
			},
			validator: {
				validate(value: any, _args: ValidationArguments) {
					return typeof value === "string" && /^[\w\W\d\s]{1,20}$/i.test(value);
				},
			},
		});
	};
}

export function IsDescription() {
	return function (object: object, propertyName: string) {
		registerDecorator({
			name: "IsDescription",
			target: object.constructor,
			propertyName,
			constraints: [],
			options: {
				message: `${propertyName} must be a valid description`,
			},
			validator: {
				validate(value: any, _args: ValidationArguments) {
					return (
						typeof value === "string" && /^[\w\W\d\s]{1,300}$/i.test(value)
					);
				},
			},
		});
	};
}

export function IsTransactionName() {
	return function (object: object, propertyName: string) {
		registerDecorator({
			name: "IsName",
			target: object.constructor,
			propertyName,
			constraints: [],
			options: {
				message: `${propertyName} must be a valid transaction name`,
			},
			validator: {
				validate(value: any, _args: ValidationArguments) {
					return typeof value === "string" && /^[\w\W\d\s]{1,30}$/i.test(value);
				},
			},
		});
	};
}

export function IsAmount() {
	return function (object: object, propertyName: string) {
		registerDecorator({
			name: "IsAmount",
			target: object.constructor,
			propertyName,
			constraints: [],
			options: {
				message: `${propertyName} must be a valid amount`,
			},
			validator: {
				validate(value: any, _args: ValidationArguments) {
					return (
						typeof value === "number" &&
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
	return function (object: object, propertyName: string) {
		registerDecorator({
			name: "isHEXColor",
			target: object.constructor,
			propertyName,
			constraints: [],
			options: {
				message: `${propertyName} must be a valid HEX color`,
			},
			validator: {
				validate(value: any, _args: ValidationArguments) {
					return typeof value === "string" && /^#[A-Fa-f0-9]{6}$/.test(value);
				},
			},
		});
	};
}

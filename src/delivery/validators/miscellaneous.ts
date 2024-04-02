import { registerDecorator, type ValidationArguments } from "class-validator";

interface IsURLValidationOptions {
	acceptLocalhost: boolean;
}
export function IsURL(validationOptions: IsURLValidationOptions) {
	return function (object: object, propertyName: string) {
		registerDecorator({
			name: "isURL",
			target: object.constructor,
			propertyName,
			constraints: [],
			options: {
				message: `${propertyName} must be a valid url`,
			},
			validator: {
				validate(value: any, _args: ValidationArguments) {
					if (typeof value !== "string") {
						return false;
					}

					if (value.includes("localhost")) {
						return validationOptions.acceptLocalhost;
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

export function IsPhone() {
	return function (object: object, propertyName: string) {
		registerDecorator({
			name: "isPhone",
			target: object.constructor,
			propertyName,
			constraints: [],
			options: {
				message: `${propertyName} must be a valid phone`,
			},
			validator: {
				validate(value: any, _args: ValidationArguments) {
					if (typeof value !== "string") {
						return false;
					}

					return /^[+][0-9]{10,20}$/.test(value);
				},
			},
		});
	};
}

export function IsTrue() {
	return function (object: object, propertyName: string) {
		registerDecorator({
			name: "IsTrue",
			target: object.constructor,
			propertyName,
			constraints: [],
			options: {
				message: `${propertyName} must be true.`,
			},
			validator: {
				validate(value: any, _args: ValidationArguments) {
					return value === true;
				},
			},
		});
	};
}

import { registerDecorator, type ValidationArguments } from "class-validator";

export function IsYear() {
	return function (object: object, propertyName: string) {
		registerDecorator({
			name: "IsYear",
			target: object.constructor,
			propertyName,
			constraints: [],
			options: {
				message: `${propertyName} must be a valid year`,
			},
			validator: {
				validate(value: any, _args: ValidationArguments) {
					return (
						typeof value === "number" &&
						Number.isInteger(value) &&
						value >= 2000 &&
						value <= 2100
					);
				},
			},
		});
	};
}

export function IsMonth() {
	return function (object: object, propertyName: string) {
		registerDecorator({
			name: "IsMonth",
			target: object.constructor,
			propertyName,
			constraints: [],
			options: {
				message: `${propertyName} must be a valid month`,
			},
			validator: {
				validate(value: any, _args: ValidationArguments) {
					return (
						typeof value === "number" &&
						Number.isInteger(value) &&
						value >= 1 &&
						value <= 12
					);
				},
			},
		});
	};
}

export function IsDay() {
	return function (object: object, propertyName: string) {
		registerDecorator({
			name: "IsDay",
			target: object.constructor,
			propertyName,
			constraints: [],
			options: {
				message: `${propertyName} must be a valid day`,
			},
			validator: {
				validate(value: any, _args: ValidationArguments) {
					return (
						typeof value === "number" &&
						Number.isInteger(value) &&
						value >= 1 &&
						value <= 31
					);
				},
			},
		});
	};
}

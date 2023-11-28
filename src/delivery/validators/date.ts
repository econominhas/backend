import { registerDecorator, type ValidationArguments } from "class-validator";

export const IsYear = () => {
	// eslint-disable-next-line @typescript-eslint/ban-types
	return (object: Object, propertyName: string) => {
		registerDecorator({
			name: "IsYear",
			target: object.constructor,
			propertyName,
			constraints: [],
			options: {
				message: `${propertyName} must be a valid year`,
			},
			validator: {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				validate: (value: any, _args: ValidationArguments) => {
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
};

export const IsMonth = () => {
	// eslint-disable-next-line @typescript-eslint/ban-types
	return (object: Object, propertyName: string) => {
		registerDecorator({
			name: "IsMonth",
			target: object.constructor,
			propertyName,
			constraints: [],
			options: {
				message: `${propertyName} must be a valid month`,
			},
			validator: {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				validate: (value: any, _args: ValidationArguments) => {
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
};

export const IsDay = () => {
	// eslint-disable-next-line @typescript-eslint/ban-types
	return (object: Object, propertyName: string) => {
		registerDecorator({
			name: "IsDay",
			target: object.constructor,
			propertyName,
			constraints: [],
			options: {
				message: `${propertyName} must be a valid day`,
			},
			validator: {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				validate: (value: any, _args: ValidationArguments) => {
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
};

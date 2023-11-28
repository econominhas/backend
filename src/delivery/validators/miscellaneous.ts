import { isDateYMD } from "@techmmunity/utils";
import { registerDecorator, type ValidationArguments } from "class-validator";

export const IsDateYYYYMMDD = () => {
	// eslint-disable-next-line @typescript-eslint/ban-types
	return (object: Object, propertyName: string) => {
		registerDecorator({
			name: "isDateYYYYMMDD",
			target: object.constructor,
			propertyName,
			constraints: [],
			options: {
				message: `${propertyName} must be a valid birth date`,
			},
			validator: {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				validate: (value: any, _args: ValidationArguments) => {
					if (typeof value !== "string") return false;

					return isDateYMD(value);
				},
			},
		});
	};
};

interface IsURLValidationOptions {
	acceptLocalhost: boolean;
}
export const IsURL = (validationOptions: IsURLValidationOptions) => {
	// eslint-disable-next-line @typescript-eslint/ban-types
	return (object: Object, propertyName: string) => {
		registerDecorator({
			name: "isURL",
			target: object.constructor,
			propertyName,
			constraints: [],
			options: {
				message: `${propertyName} must be a valid url`,
			},
			validator: {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				validate: (value: any, _args: ValidationArguments) => {
					if (typeof value !== "string") return false;

					if (value.includes("localhost")) {
						return validationOptions.acceptLocalhost;
					}

					try {
						// eslint-disable-next-line no-new
						new URL(value);

						return true;
					} catch (_) {
						return false;
					}
				},
			},
		});
	};
};

export const IsPhone = () => {
	// eslint-disable-next-line @typescript-eslint/ban-types
	return (object: Object, propertyName: string) => {
		registerDecorator({
			name: "isPhone",
			target: object.constructor,
			propertyName,
			constraints: [],
			options: {
				message: `${propertyName} must be a valid phone`,
			},
			validator: {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				validate: (value: any, _args: ValidationArguments) => {
					if (typeof value !== "string") return false;

					return /^[+][0-9]{10,20}$/.test(value);
				},
			},
		});
	};
};

export const IsNumberString = (length: number) => {
	// eslint-disable-next-line @typescript-eslint/ban-types
	return (object: Object, propertyName: string) => {
		registerDecorator({
			name: "IsNumberString",
			target: object.constructor,
			propertyName,
			constraints: [],
			options: {
				message: `${propertyName} must be a valid number string with length of ${length}.`,
			},
			validator: {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				validate: (value: any, _args: ValidationArguments) => {
					if (typeof value !== "string") return false;

					return /^[0-9]*$/.test(value) && value.length === length;
				},
			},
		});
	};
};

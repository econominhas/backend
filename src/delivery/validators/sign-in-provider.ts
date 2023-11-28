import { registerDecorator, type ValidationArguments } from "class-validator";

export const IsSingInProviderCode = () => {
	// eslint-disable-next-line @typescript-eslint/ban-types
	return (object: Object, propertyName: string) => {
		registerDecorator({
			name: "IsSingInProviderCode",
			target: object.constructor,
			propertyName,
			constraints: [],
			options: {
				message: `${propertyName} must be a valid provider code`,
			},
			validator: {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				validate: (value: any, _args: ValidationArguments) => {
					return typeof value === "string" && /^[a-z0-9]*$/i.test(value);
				},
			},
		});
	};
};

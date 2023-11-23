import {
	registerDecorator,
	ValidationOptions,
	ValidationArguments,
} from 'class-validator';

export function IsSingInProviderCode(
	validationOptions: ValidationOptions = {},
) {
	// eslint-disable-next-line @typescript-eslint/ban-types
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: 'IsSingInProviderCode',
			target: object.constructor,
			propertyName: propertyName,
			constraints: [],
			options: {
				message: `${propertyName} must be a valid provider code`,
				...validationOptions,
			},
			validator: {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				validate(value: any, _args: ValidationArguments) {
					return typeof value === 'string' && /^[a-z0-9]*$/i.test(value);
				},
			},
		});
	};
}

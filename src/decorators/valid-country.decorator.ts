import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { getCodes } from 'country-list';

export function IsValidCountry(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidCountry',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;

          const countryCodes = getCodes()
          const isValidCode = Boolean(countryCodes.find((code) => code === value))

          return isValidCode
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid country code.`;
        },
      },
    });
  };
}
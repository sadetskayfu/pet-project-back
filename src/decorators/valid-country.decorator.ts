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
          const countryCodes = getCodes()

          if(Array.isArray(value)) {
            const set = new Set(countryCodes)

            return value.every((code) => set.has(code))
          }

          if(typeof value === 'string') {
            return Boolean(countryCodes.find((code) => code === value))
          }

          return false
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid country code.`;
        },
      },
    });
  };
}
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsHalfStep(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isHalfNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: number) {
            return value % 0.5 === 0
        },
        defaultMessage() {
          return `The number should have a step of 0.5`;
        },
      },
    });
  };
}
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

// @MatchesField('password') validates that this field equals another field on the same object.
// Used for confirmPassword === password check.
export function MatchesField(fieldName: string, options?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'matchesField',
      target: object.constructor,
      propertyName,
      constraints: [fieldName],
      options: {
        message: `${propertyName} must match ${fieldName}`,
        ...options,
      },
      validator: {
        validate(value: unknown, args: ValidationArguments): boolean {
          const [related] = args.constraints as string[];
          return value === (args.object as Record<string, unknown>)[related];
        },
      },
    });
  };
}

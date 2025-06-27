import { z, type ZodString, ZodNumber, ZodOptional } from "zod";

type ZodTypeFn = ZodString | ZodNumber | ZodOptional<ZodString | ZodNumber>;

/**
 * Returns a z.string() or a z.number() primitive
 * with a validation fn chained on i.e.
 *
 * z.string().min(2)
 * z.number().max(19)
 */
export const jsonValidationToZodFn = (
  zodTypeFn: ZodTypeFn,
  validationPropertyKey?: keyof Validations["validation"],
  validatorArgument?: string | number | boolean
): ZodTypeFn => {
  const validatonKeyToZod = {
    ...(validationPropertyKey === "min" && {
      min:
        typeof validatorArgument === "number" && "min" in zodTypeFn
          ? zodTypeFn?.min(validatorArgument)
          : zodTypeFn,
    }),
    ...(validationPropertyKey === "max" && {
      max:
        typeof validatorArgument === "number" && "max" in zodTypeFn
          ? zodTypeFn?.max(validatorArgument)
          : zodTypeFn,
    }),
    ...(validationPropertyKey === "optional"
      ? {
          // Cast here to it doesn't return as
          // ZodOptional<ZodOptional<ZodString | ZodNumber>>
          optional: zodTypeFn?.optional() as ZodOptional<ZodString | ZodNumber>,
        }
      : {}),
  };

  if (
    validationPropertyKey &&
    validationPropertyKey in validatonKeyToZod &&
    validatonKeyToZod[validationPropertyKey]
  ) {
    return validatonKeyToZod[validationPropertyKey];
  }

  return zodTypeFn;
};

/**
 * Loops over each field's validation properties to
 * chain Zod validation(s) together
 *
 * z.string().min(2).max(19)
 * z.number().max(22).optional()
 */
export const chainFieldValidations = (
  field: Validations,
  zodValidator: ZodTypeFn
) => {
  let validator = zodValidator;
  Object.entries(field.validation).forEach(([validationKey, val]) => {
    validator = jsonValidationToZodFn(
      validator,
      validationKey as keyof Validations["validation"],
      val
    );
  });

  return validator;
};

/**
 * Loops over each fieldset and it's fields
 * to return a schema i.e.
 *
 * {
 *   "name": z.string().min(1).max(12),
 *   "age": z.min(18).optional()
 * }
 */
export const jsonDataToZodSchema = (jsonData: SchemaType) => {
  const fieldValidations: Record<string, ZodTypeFn> = {};

  if (jsonData?.properties) {
    Object.entries(jsonData?.properties).forEach(([, fieldset]) => {
      if (fieldset?.properties) {
        Object.entries(fieldset?.properties).forEach(
          ([fieldName, fieldProperties]) => {
            if (z[fieldProperties.type] !== undefined) {
              fieldValidations[fieldName] = chainFieldValidations(
                fieldProperties,
                z[fieldProperties.type]()
              );
            }
          }
        );
      }
    });
  }

  return z.object(fieldValidations);
};

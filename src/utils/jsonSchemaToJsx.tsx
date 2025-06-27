import { type UseFormRegister, type FieldErrors } from "react-hook-form";

import { Fieldset } from "../components/Fieldset";
import { StringField } from "../components/StringField";
import { NumberField } from "../components/NumberField";

export const mapPropertyTypeToField = {
  fieldset: Fieldset,
  string: StringField,
  number: NumberField,
};

export const jsonSchemaToJsx = (
  jsonData: SchemaType,
  register: UseFormRegister<FormState>,
  errors: FieldErrors<FormState>
) => {
  return Object.entries(jsonData.properties).map(([key, fieldset]) => {
    const FieldsetComponent =
      mapPropertyTypeToField[fieldset?.props?.formComponent];

    if (FieldsetComponent) {
      return (
        <FieldsetComponent
          key={key}
          label={fieldset.props.label}
          formComponent="fieldset"
        >
          {fieldset.properties
            ? Object.entries(fieldset.properties).map(
                ([fieldName, fieldProperties]) => {
                  if (
                    mapPropertyTypeToField[fieldProperties.props.formComponent]
                  ) {
                    return mapPropertyTypeToField[fieldProperties.type](
                      {
                        ...fieldProperties.props,
                        name: fieldName,
                        key: fieldName,
                        required: !fieldProperties.validation.optional,
                      },
                      register,
                      errors
                    );
                  }

                  return null;
                }
              )
            : null}
        </FieldsetComponent>
      );
    }
    return null;
  });
};

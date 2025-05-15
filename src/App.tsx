import React, { type ReactNode, useState } from "react";

import { z } from "zod";

import jsonData from "./jsonData.json";
import type { FormEvent } from "react";

type FormState = Record<string, "string" | "number">;

const Fieldset = ({
  label,
  children,
}: {
  children: ReactNode;
} & FieldProps) => {
  return (
    <fieldset>
      <legend>{label}</legend>
      {children}
    </fieldset>
  );
};

const StringField = (
  props: FieldProps,
  value: any,
  setFormState: any,
  formErrors: z.ZodIssue[]
) => {
  return (
    <div>
      <label>{props.label}</label>
      <input
        value={value}
        type="string"
        onChange={(e) => {
          setFormState(e.target.value);
        }}
      />
      {formErrors.map((error) => (
        <p>{error.message}</p>
      ))}
    </div>
  );
};

const NumberField = (
  props: FieldProps,
  value: any,
  setFormState: any,
  formErrors: z.ZodIssue[]
) => {
  return (
    <div>
      <label>{props.label}</label>
      <input
        value={value}
        type="number"
        onChange={(e) => {
          setFormState(parseInt(e.target.value));
        }}
      />
      {formErrors.map((error) => (
        <p>{error.message}</p>
      ))}
    </div>
  );
};

const mapPropertyTypeToField = {
  fieldset: Fieldset,
  string: StringField,
  number: NumberField,
};

const jsonSchemaToFields = (
  schema: SchemaType,
  formState: FormState,
  setFormState: React.Dispatch<React.SetStateAction<FormState>>,
  formErrors: z.ZodIssue[]
) => {
  return Object.entries(schema.properties).map(([, fieldset]) => {
    const FieldsetComponent =
      mapPropertyTypeToField[fieldset.props.formComponent];

    return (
      <FieldsetComponent label={fieldset.props.label} formComponent="fieldset">
        {Object.entries(fieldset.properties).map(([key, field]) => {
          return mapPropertyTypeToField[field.type](
            field.props,
            formState[key],
            (value: FieldTypes) =>
              setFormState((prevState) => ({
                ...prevState,
                [key]: value,
              })),
            formErrors.filter((error) => error.path.includes(key))
          );
        })}
      </FieldsetComponent>
    );
  });
};

const jsonDataToZodSchema = (jsonData: SchemaType) => {
  const validation: Record<string, z.ZodString | z.ZodNumber> = {};

  // Super verbose and unelegant
  Object.entries(jsonData.properties).forEach(([_, fieldset]) => {
    Object.entries(fieldset.properties).forEach(([key, field]) => {
      if (field.type === "string" && field.minLength) {
        validation[key] = z.string().min(field.minLength);
      }

      if (field.type === "number" && field.min) {
        validation[key] = z.number().min(field.min);
      }
    });
  });

  return z.object(validation);
};

function App() {
  const [formState, setFormState] = useState<FormState>({});

  const [formErrors, setFormErrors] = useState<z.ZodIssue[]>([]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    setFormErrors([]);

    try {
      const validator = jsonDataToZodSchema(jsonData as SchemaType);
      validator.parse(formState);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setFormErrors(err.issues);
      }
    }
  };

  return (
    <form onSubmit={onSubmit}>
      {jsonSchemaToFields(
        jsonData as SchemaType,
        formState,
        setFormState,
        formErrors
      )}
      <button>Submit</button>
    </form>
  );
}

export default App;

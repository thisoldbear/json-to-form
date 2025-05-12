import React, { useState } from "react";

import { z } from "zod";

import jsonData from "./jsonData.json";
import { FormEvent } from "react";

type FormState = Record<string, "string" | "number">;

const StringField = (
  props: ReactProps,
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
  props: ReactProps,
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
  string: StringField,
  number: NumberField,
};

const jsonSchemaToFields = (
  schema: SchemaType,
  formState: FormState,
  setFormState: React.Dispatch<React.SetStateAction<FormState>>,
  formErrors: z.ZodIssue[]
) => {
  return Object.entries(schema.properties).map(([key, property]) => {
    return (
      <>
        {mapPropertyTypeToField[property.type](
          property.reactProps,
          formState[key],
          (value: "string" | "number") =>
            setFormState((prevState) => ({
              ...prevState,
              [key]: value,
            })),
          formErrors.filter((error) => error.path.includes(key))
        )}
      </>
    );
  });
};

const jsonDataToZodSchema = (jsonData: SchemaType) => {
  const validation: Record<string, z.ZodString | z.ZodNumber> = {};

  // Super verbose and unelegant
  Object.entries(jsonData.properties).forEach(([key, property]) => {
    if (property.type === "string" && property.minLength) {
      validation[key] = z.string().min(property.minLength);
    }

    if (property.type === "number" && property.min) {
      validation[key] = z.number().min(property.min);
    }
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

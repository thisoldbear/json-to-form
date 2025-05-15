import { type ReactNode } from "react";
import {
  useForm,
  type UseFormRegister,
  type SubmitHandler,
  type FieldErrors,
} from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import jsonData from "./jsonData.json";

type FormState = { [x: string]: string | number };

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
  props: FieldProps & {
    name: string;
  },
  register: UseFormRegister<FormState>,
  errors: FieldErrors<FormState>
) => {
  return (
    <div>
      <label>{props.label}</label>
      <input {...register(props.name)} type="string" />
      <p>{errors?.[props?.name]?.message}</p>
    </div>
  );
};

const NumberField = (
  props: FieldProps & {
    name: string;
  },
  register: UseFormRegister<FormState>,
  errors: FieldErrors<FormState>
) => {
  return (
    <div>
      <label>{props.label}</label>
      <input
        type="number"
        {...register(props.name, {
          setValueAs: (v) => (v === "" ? undefined : parseInt(v, 10)),
        })}
      />
      <p>{errors?.[props?.name]?.message}</p>
    </div>
  );
};

const mapPropertyTypeToField = {
  fieldset: Fieldset,
  string: StringField,
  number: NumberField,
};

const jsonSchemaToFields = (
  jsonData: SchemaType,
  register: UseFormRegister<FormState>,
  errors: FieldErrors<FormState>
) => {
  return Object.entries(jsonData.properties).map(([, fieldset]) => {
    const FieldsetComponent =
      mapPropertyTypeToField[fieldset.props.formComponent];

    return (
      <FieldsetComponent label={fieldset.props.label} formComponent="fieldset">
        {Object.entries(fieldset.properties).map(([name, field]) => {
          return mapPropertyTypeToField[field.type](
            { ...field.props, name: name },
            register,
            errors
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormState>({
    resolver: zodResolver(jsonDataToZodSchema(jsonData as SchemaType)),
  });

  const onSubmit: SubmitHandler<FormState> = (data) => {
    alert(JSON.stringify(data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {jsonSchemaToFields(jsonData as SchemaType, register, errors)}
      <button>Submit</button>
    </form>
  );
}

export default App;

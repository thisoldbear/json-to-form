type Validations = {
  validation: Partial<{
    min: number;
    max: number;
    optional: boolean;
  }>;
};

type FieldProps = {
  label: string;
  formComponent: "fieldset" | FieldTypes;
};

type FieldsetProps = {
  label: string;
  formComponent: "fieldset";
};

type FieldTypes = "string" | "number";

type FieldProperties = {
  [key: string]: {
    type: FieldTypes;
    props: FieldProps;
  } & Validations;
};

type SchemaType = {
  $schema: string;
  type: string;
  properties: {
    [key: string]: {
      type: "object";
      props: FieldsetProps;
      properties?: FieldProperties;
    };
  };
  required: string[];
};

type FormState = { [x: string]: string | number | undefined };

type MinLength = {
  minLength: number;
};

type Min = {
  min: number;
};

type Max = {
  max: number;
};

type Validations = Partial<Min & Max & MinLength>;

type FieldProps = {
  label: string;
  formComponent: "fieldset" | FieldTypes;
};

type FieldsetProps = {
  label: string;
  formComponent: "fieldset";
};

type FieldTypes = "string" | "number";

type SchemaType = {
  $schema: string;
  type: string;
  properties: {
    [key: string]: {
      type: "object";
      props: FieldsetProps;
      properties: {
        [key: string]: {
          type: FieldTypes;
          props: FieldProps;
        } & Validations;
      };
    };
  };
  required: string[];
};

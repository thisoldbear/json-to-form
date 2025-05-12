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

type ReactProps = {
  label: string;
};

type PropertyTypes = "string" | "number";

type SchemaType = {
  $schema: string;
  type: string;
  properties: {
    [key: string]: {
      type: PropertyTypes;
      reactProps: ReactProps;
    } & Validations;
  };
  required: string[];
};

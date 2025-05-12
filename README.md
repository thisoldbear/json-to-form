Parse JSON data in the shape of:

```
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
```

to render a form validated with [Zod](https://zod.dev/)

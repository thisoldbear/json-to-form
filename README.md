# json-to-form

Parse JSON data to render a form validated with [Zod](https://zod.dev/).

Works by looping over JSON to return a Zod schema:

```json
{
  "name": {
    "type": "string",
    "validation": {
      "min": 3,
      "max": 20
    },
    "props": {
      "label": "Name",
      "formComponent": "string"
    }
  },
  "age": {
    "type": "number",
    "validation": {
      "min": 18,
      "optional": true
    },
    "props": {
      "label": "Age",
      "formComponent": "number"
    }
  }
}
```

```js
{
    "name": z.string().min(3).max(20),
    "age": z.number().min(18).optional()
}
```

And renders fields by mapping `formComponent` properties to React components:

```jsx
<Fieldset>
  <StringField label="Name" />
  <NumberField label="Age" />
</Fieldset>
```

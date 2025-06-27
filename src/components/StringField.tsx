import { type UseFormRegister, type FieldErrors } from "react-hook-form";

export const StringField = (
  props: FieldProps & {
    name: string;
    key: string;
    required?: boolean;
  },
  register: UseFormRegister<FormState>,
  errors: FieldErrors<FormState>
) => {
  return (
    <div key={props.key}>
      <label
        style={{
          display: "block",
        }}
      >
        {props.label} {props.required && `* `}
      </label>
      <input {...register(props.name)} type="string" />
      <p
        style={{
          color: "red",
        }}
      >
        {errors?.[props?.name]?.message}
      </p>
    </div>
  );
};

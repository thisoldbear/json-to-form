import { type UseFormRegister, type FieldErrors } from "react-hook-form";

export const NumberField = (
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
      <input
        type="number"
        {...register(props.name, {
          setValueAs: (v) => (v === "" ? undefined : parseInt(v, 10)),
        })}
      />
      <p style={{ color: "red" }}>{errors?.[props?.name]?.message}</p>
    </div>
  );
};

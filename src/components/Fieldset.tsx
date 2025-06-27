import type { FC } from "react";

export const Fieldset: FC<React.PropsWithChildren<FieldProps>> = ({
  label,
  children,
}) => {
  return (
    <fieldset>
      <legend>{label}</legend>
      {children}
    </fieldset>
  );
};

import React, { ReactNode, useMemo } from "react";
import { FieldErrors, FieldValues } from "react-hook-form";

import { generateId } from "utils/string";

export interface AdminInputProps {
  name: string;
  label?: ReactNode | string;
  register: (Ref: unknown, RegisterOptions?: unknown) => void;
  errors?: FieldErrors<FieldValues>;
}

export const AdminInput: React.FC<AdminInputProps> = ({
  name,
  label,
  register,
  errors,
}) => {
  const error = errors?.[name];
  const id = useMemo(() => generateId("AdminInput-" + name), [name]);
  return (
    <p className="AdminInput">
      <label className="AdminInput__label" htmlFor={id}>
        {label}
      </label>
      <input className="AdminInput__input" name={name} ref={register} id={id} />
      {error && <div className="AdminInput__error">{error?.message}</div>}
    </p>
  );
};

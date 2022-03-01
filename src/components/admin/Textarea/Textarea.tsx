import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import classNames from "classnames";
import { get } from "lodash";

import { DEFAULT_TEXTAREA_ROWS } from "settings";

import { AnyForm } from "types/utility";

import * as TW from "./Textarea.tailwind";

import CN from "./Textarea.module.scss";

interface TextareaProps extends React.HTMLProps<HTMLTextAreaElement> {
  register: UseFormRegister<AnyForm>;
  errors?: FieldErrors<FieldValues>;
  name: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  rows = DEFAULT_TEXTAREA_ROWS,
  register,
  errors,
  name,
  ...props
}) => {
  const error = get(errors, name);

  return (
    <div className="mt-1">
      <textarea
        {...props}
        {...register(name)}
        rows={rows}
        name={name}
        className={classNames(
          "Textarea shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md",
          CN.textarea
        )}
      />
      {error && <span className={TW.error}>{error?.message}</span>}
    </div>
  );
};

import React from "react";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";
import classNames from "classnames";

import { AnyForm, ContainerClassName } from "types/utility";

import { isDefined } from "utils/types";

import styles from "./InputSelect.module.scss";

const urlSources: Record<string, string> = {
  facebook: "Facebook",
  twitter: "Twitter",
  bandcamp: "Bandcamp",
  website: "Website",
};

interface InputSelectProps
  extends React.HTMLProps<HTMLInputElement>,
    ContainerClassName {
  inputClassName?: string;
  errorTextClassName?: string;
  error?: FieldError;
  inputName: string;
  selectName: string;
  inputPlaceholder?: string;
  selectPlaceholder?: string;
  register: UseFormRegister<AnyForm>;
  inputRules: RegisterOptions;
  selectRules: RegisterOptions;
}

export const InputSelect: React.FC<InputSelectProps> = ({
  containerClassName,
  inputClassName,
  errorTextClassName,
  error,
  label,
  inputName,
  selectName,
  inputPlaceholder,
  selectPlaceholder,
  register,
  inputRules,
  selectRules,
}) => {
  const containerClassNames = classNames(
    styles.inputSelect,
    {
      [styles.invalid]: isDefined(error),
    },
    containerClassName
  );
  const selectContainerClassNames = classNames(
    styles.inputSelect,
    {
      [styles.invalid]: isDefined(error),
    },
    containerClassName
  );

  const inputClassNames = classNames(styles.input, inputClassName);
  const selectClassNames = classNames(styles.select, selectContainerClassNames);

  return (
    <div className={containerClassNames}>
      <div className={styles.wrapper}>
        <input
          className={inputClassNames}
          placeholder={inputPlaceholder}
          {...register(inputName, inputRules)}
        />
        <select
          className={selectClassNames}
          defaultValue={selectPlaceholder}
          {...register(selectName, selectRules)}
        >
          <option value={selectPlaceholder} hidden disabled>
            {selectPlaceholder}
          </option>
          {Object.entries(urlSources).map(([key, label]) => (
            <option key={key} value={label}>
              {label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <span className={classNames("error", errorTextClassName)}>
          {error.message}
        </span>
      )}
    </div>
  );
};

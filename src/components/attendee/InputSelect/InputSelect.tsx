import React from "react";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";
import classNames from "classnames";

import { AnyForm, ContainerClassName } from "types/utility";

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
  errorSelect?: FieldError;
  errorInput?: FieldError;
  inputName: string;
  selectName: string;
  inputPlaceholder?: string;
  selectPlaceholder?: string;
  register: UseFormRegister<AnyForm>;
  inputRules?: RegisterOptions;
  selectRules?: RegisterOptions;
}

export const InputSelect: React.FC<InputSelectProps> = ({
  containerClassName,
  inputClassName,
  errorTextClassName,
  errorSelect,
  errorInput,
  inputName,
  selectName,
  inputPlaceholder,
  selectPlaceholder,
  register,
  inputRules = {},
  selectRules = {},
}) => {
  const containerClassNames = classNames(
    styles.inputSelect,
    containerClassName
  );

  const wrapperClassNames = classNames(styles.inputWrapper, {
    [styles.invalid]: errorInput,
  });

  const inputClassNames = classNames(styles.input, inputClassName);

  const selectWrapperClassNames = classNames(styles.selectWrapper, {
    [styles.invalid]: errorSelect,
  });
  const selectClassNames = classNames(styles.select, containerClassNames);

  return (
    <div className={containerClassNames}>
      <form className={styles.wrapper} autoComplete="off">
        <div className={wrapperClassNames}>
          <input
            className={inputClassNames}
            placeholder={inputPlaceholder}
            autoComplete="off"
            {...register(inputName, inputRules)}
          />
          {errorInput && <span className={styles.errorIcon}></span>}
        </div>
        <div className={selectWrapperClassNames}>
          <select
            className={selectClassNames}
            {...register(selectName, selectRules)}
          >
            <option value={""} disabled>
              {selectPlaceholder}
            </option>
            {Object.entries(urlSources).map(([key, label]) => (
              <option key={key} value={label}>
                {label}
              </option>
            ))}
          </select>
          {errorSelect && (
            <span className={classNames(styles.error, errorTextClassName)}>
              {errorSelect?.message}
            </span>
          )}
        </div>
      </form>
      {errorInput && (
        <span className={classNames(styles.error, errorTextClassName)}>
          {errorInput?.message}
        </span>
      )}
    </div>
  );
};

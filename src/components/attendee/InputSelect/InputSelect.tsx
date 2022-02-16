import React, { ChangeEvent } from "react";
import { FieldError } from "react-hook-form";
import classNames from "classnames";

import { ContainerClassName } from "types/utility";

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
  inputOnChange: (e: ChangeEvent<HTMLInputElement>) => void;
  selectOnChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  selectRef: React.ForwardedRef<HTMLSelectElement>;
  inputRef: React.ForwardedRef<HTMLInputElement>;
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
  inputOnChange,
  selectOnChange,
  selectRef,
  inputRef,
}) => {
  const containerClassNames = classNames(
    styles.InputSelect,
    {
      [styles.InputSelect__invalid]: isDefined(error),
    },
    containerClassName
  );
  const selectContainerClassNames = classNames(
    styles.InputSelect,
    {
      [styles.InputSelect__invalid]: isDefined(error),
    },
    containerClassName
  );

  const inputClassNames = classNames(styles.InputSelect__input, inputClassName);
  const selectClassNames = classNames(
    styles.InputSelect__select,
    selectContainerClassNames
  );

  return (
    <div className={containerClassNames}>
      <div className={styles.InputSelect__wrapper}>
        <input
          ref={inputRef}
          className={inputClassNames}
          onChange={inputOnChange}
          name={inputName}
          placeholder={inputPlaceholder}
        />
        <select
          className={selectClassNames}
          ref={selectRef}
          defaultValue={selectPlaceholder}
          onChange={selectOnChange}
          name={selectName}
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
        <span className={classNames("InputSelect__error", errorTextClassName)}>
          {error.message}
        </span>
      )}
    </div>
  );
};

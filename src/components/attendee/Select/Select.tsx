import React, { ChangeEvent } from "react";
import { FieldError } from "react-hook-form";
import classNames from "classnames";

import { ContainerClassName } from "types/utility";

import { isDefined } from "utils/types";

import styles from "./Select.module.scss";

const urlSources: Record<string, string> = {
  facebook: "Facebook",
  twitter: "Twitter",
  bandcamp: "Bandcamp",
  website: "Website",
};

interface SelectProps
  extends React.HTMLProps<HTMLSelectElement>,
    ContainerClassName {
  errorTextClassName?: string;
  error?: FieldError;
  name: string;
  placeholder?: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  ref: React.ForwardedRef<HTMLSelectElement>;
}

export const Select: React.FC<SelectProps> = ({
  containerClassName,
  errorTextClassName,
  error,
  label,
  name,
  placeholder,
  onChange,
  ref,
}) => {
  const containerClassNames = classNames(
    styles.Select,
    {
      [styles.Select__invalid]: isDefined(error),
    },
    containerClassName
  );
  const selectContainerClassNames = classNames(
    styles.Select,
    {
      [styles.Select__invalid]: isDefined(error),
    },
    containerClassName
  );

  const selectClassNames = classNames(
    styles.Select__select,
    selectContainerClassNames
  );

  return (
    <div className={containerClassNames}>
      <div className={styles.Select__wrapper}>
        {label && <label>{label}</label>}
        <select
          className={selectClassNames}
          ref={ref}
          defaultValue={placeholder}
          name={name}
        >
          <option value={placeholder} hidden disabled>
            {placeholder}
          </option>
          {Object.entries(urlSources).map(([key, label]) => (
            <option key={key} value={label}>
              {label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <span className={classNames("Select__error", errorTextClassName)}>
          {error.message}
        </span>
      )}
    </div>
  );
};

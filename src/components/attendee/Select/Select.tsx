import React from "react";
import { FieldError, UseFormRegister } from "react-hook-form";
import classNames from "classnames";

import { UserProfileModalFormData } from "types/profileModal";
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
  name: "videoSource" | "speakerSource" | "micSource";
  placeholder?: string;
  register: UseFormRegister<UserProfileModalFormData>;
}

export const Select: React.FC<SelectProps> = ({
  containerClassName,
  errorTextClassName,
  error,
  label,
  name,
  placeholder,
  register,
}) => {
  const containerClassNames = classNames(
    styles.select,
    {
      [styles.invalid]: isDefined(error),
    },
    containerClassName
  );
  const selectContainerClassNames = classNames(
    styles.select,
    {
      [styles.invalid]: isDefined(error),
    },
    containerClassName
  );

  const selectClassNames = classNames(
    styles.selectField,
    selectContainerClassNames
  );

  return (
    <div className={containerClassNames}>
      <div className={styles.wrapper}>
        {label && <label>{label}</label>}
        <select
          className={selectClassNames}
          {...register(name)}
          defaultValue={placeholder}
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
        <span className={classNames(styles.error, errorTextClassName)}>
          {error.message}
        </span>
      )}
    </div>
  );
};

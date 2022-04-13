import React from "react";
import {
  FieldError,
  RegisterOptions,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import classNames from "classnames";
import { ProfileLinkIcon } from "components/attendee/ProfileLinkIcon";

import { UserProfileModalFormData } from "types/profileModal";
import { AnyForm, ContainerClassName } from "types/utility";

import styles from "./InputSelect.module.scss";

interface InputSelectProps
  extends React.HTMLProps<HTMLInputElement>,
    ContainerClassName {
  inputClassName?: string;
  errorTextClassName?: string;
  errorSelect?: FieldError;
  errorInput?: FieldError;
  inputName: string;
  index: number;
  inputPlaceholder?: string;
  selectPlaceholder?: string;
  register: UseFormRegister<AnyForm>;
  inputRules?: RegisterOptions;
  selectRules?: RegisterOptions;
  urlValue?: string;
  setValue: UseFormSetValue<UserProfileModalFormData>;
}

export const InputSelect: React.FC<InputSelectProps> = ({
  containerClassName,
  inputClassName,
  errorTextClassName,
  errorInput,
  inputName,
  index,
  inputPlaceholder,
  urlValue = "",
  register,
  // TODO: possibly unite rules into a single object
  inputRules = {},
  setValue,
}) => {
  const containerClassNames = classNames(
    styles.inputSelect,
    containerClassName
  );

  const wrapperClassNames = classNames(styles.inputWrapper, {
    [styles.invalid]: errorInput,
  });

  const inputClassNames = classNames(styles.input, inputClassName);

  return (
    <div className={containerClassNames}>
      <form className={styles.wrapper} autoComplete="off">
        <div className={styles.inputContainer}>
          <div className={wrapperClassNames}>
            <input
              className={inputClassNames}
              placeholder={inputPlaceholder}
              autoComplete="off"
              {...register(inputName, inputRules)}
            />
            {errorInput && <span className={styles.errorIcon}></span>}
          </div>
          {errorInput && (
            <span className={classNames(styles.error, errorTextClassName)}>
              {errorInput?.message}
            </span>
          )}
        </div>
        <ProfileLinkIcon link={urlValue} index={index} setLinkIcon={setValue} />
      </form>
    </div>
  );
};

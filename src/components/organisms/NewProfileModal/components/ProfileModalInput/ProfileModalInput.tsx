import React from "react";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import classNames from "classnames";

import { ALWAYS_EMPTY_OBJECT } from "settings";

import { UserProfileModalFormData } from "types/profileModal";
import { ContainerClassName } from "types/utility";

import { InputField } from "components/atoms/InputField";

import "./ProfileModalInput.scss";

export interface ProfileModalInputProps
  extends ContainerClassName,
    React.HTMLProps<HTMLInputElement> {
  error?: FieldError;
  notCondensed?: boolean;
  iconEnd?: IconProp | JSX.Element;
  register: UseFormRegister<UserProfileModalFormData>;
  name: string;
  rules?: RegisterOptions;
}

export const ProfileModalInput: React.FC<ProfileModalInputProps> = ({
  error,
  containerClassName,
  notCondensed,
  iconEnd,
  register,
  name,
  rules = ALWAYS_EMPTY_OBJECT,
  ...rest
}) => {
  return (
    <InputField
      error={error}
      containerClassName={containerClassName}
      iconEnd={iconEnd}
      inputClassName={classNames("ProfileModalInput__input", {
        "ProfileModalInput__input--condensed": !notCondensed,
      })}
      errorTextClassName={classNames("ProfileModalInput__error-message", {
        "ProfileModalInput__error-message--condensed": !notCondensed,
      })}
      iconEndClassName="ProfileModalInput__icon-end"
      register={register}
      name={name}
      rules={rules}
      {...rest}
    />
  );
};

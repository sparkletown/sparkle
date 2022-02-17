import React from "react";
import { FieldError, UseFormRegister } from "react-hook-form";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import classNames from "classnames";

import { ContainerClassName } from "types/utility";

import { InputField } from "components/atoms/InputField";

import "./ProfileModalInput.scss";

export interface ProfileModalInputProps
  extends ContainerClassName,
    React.HTMLProps<HTMLInputElement> {
  error?: FieldError;
  notCondensed?: boolean;
  iconEnd?: IconProp | JSX.Element;
  register: UseFormRegister<any>;
  name: string;
  rules?: Record<string, any>;
}

export const ProfileModalInput = React.forwardRef<
  HTMLInputElement,
  ProfileModalInputProps
>(
  (
    {
      error,
      containerClassName,
      notCondensed,
      iconEnd,
      register,
      name,
      rules = {},
      ...rest
    },
    ref
  ) => {
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
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        register={register}
        name={name}
        rules={rules}
        {...rest}
      />
    );
  }
);

ProfileModalInput.displayName = "ProfileModalInput";

import classNames from "classnames";
import React from "react";
import { FieldError } from "react-hook-form";
import { ContainerClassName } from "types/utility";
import "./ProfileModalInput.scss";

interface Props extends ContainerClassName, React.HTMLProps<HTMLInputElement> {
  error?: FieldError;
  notCondensed?: boolean;
}

export const ProfileModalInput = React.forwardRef<HTMLInputElement, Props>(
  ({ error, className, containerClassName, notCondensed, ...rest }, ref) => {
    const restWithPlaceholder =
      error?.type === "required"
        ? {
            ...rest,
            placeholder: rest?.placeholder
              ? `${rest.placeholder} can't be empty`
              : "Can't be empty",
          }
        : rest;

    return (
      <div className={classNames("ProfileModalInput", containerClassName)}>
        <input
          className={classNames(
            "ProfileModalInput__input",
            {
              "ProfileModalInput__input--invalid": !!error,
              "ProfileModalInput__input--condensed": !notCondensed,
            },
            className
          )}
          ref={ref}
          {...restWithPlaceholder}
        />
        {error && error.type !== "required" && (
          <div className={"ProfileModalInput__error-message"}>
            {error.message}
          </div>
        )}
      </div>
    );
  }
);

ProfileModalInput.displayName = "ProfileModalInput";

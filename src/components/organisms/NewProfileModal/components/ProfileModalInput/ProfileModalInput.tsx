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
  ({ error, className, containerClassName, notCondensed, ...rest }, ref) => (
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
        {...rest}
      />
      {error && (
        <div
          className={classNames("ProfileModalInput__error-message", {
            "ProfileModalInput__error-message--condensed": !notCondensed,
          })}
        >
          {error.type === "required" && rest.placeholder
            ? `${rest.placeholder} cannot be empty`
            : error.message}
        </div>
      )}
    </div>
  )
);

ProfileModalInput.displayName = "ProfileModalInput";

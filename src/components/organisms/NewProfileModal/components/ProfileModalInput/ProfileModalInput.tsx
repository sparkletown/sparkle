import React from "react";
import { FieldError } from "react-hook-form";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import classNames from "classnames";

import { ContainerClassName } from "types/utility";

import { InputField } from "components/atoms/InputField";

import "./ProfileModalInput.scss";

interface Props extends ContainerClassName, React.HTMLProps<HTMLInputElement> {
  error?: FieldError;
  notCondensed?: boolean;
  iconEnd?: IconProp | JSX.Element;
}

export const ProfileModalInput = React.forwardRef<HTMLInputElement, Props>(
  ({ error, containerClassName, notCondensed, iconEnd, ...rest }, ref) => {
    return (
      <div>
        <InputField
          containerClassName={containerClassName}
          iconEnd={iconEnd}
          inputClassName={classNames("ProfileModalInput__input", {
            "ProfileModalInput__input--condensed": !notCondensed,
          })}
          iconEndClassName="ProfileModalInput__icon-end"
          //eslint-disable-next-line @typescript-eslint/no-explicit-any
          ref={ref as any}
          {...rest}
        />
        {
          <span
            className={classNames("ProfileModalInput__error-message", {
              "ProfileModalInput__error-message--hidden": !error,
              "ProfileModalInput__error-message--condensed": !notCondensed,
            })}
          >
            {error?.message ?? "empty error"}
          </span>
        }
      </div>
    );
  }
);

ProfileModalInput.displayName = "ProfileModalInput";

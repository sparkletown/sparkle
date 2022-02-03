import React from "react";

import { Checkbox, CheckboxProps } from "components/atoms/Checkbox";

export interface TogglerProps
  extends Omit<CheckboxProps, "toggler" | "checked" | "defaultChecked"> {
  toggled?: boolean;
  title?: string;
  defaultToggled?: boolean;
}

export const Toggler: React.FC<TogglerProps> = ({
  toggled,
  title,
  defaultToggled,
  ...extraProps
}) => (
  <>
    {title && <label>{title}</label>}
    <Checkbox
      {...extraProps}
      toggler
      defaultChecked={defaultToggled}
      checked={toggled}
      containerClassName="Toggler"
    />
  </>
);

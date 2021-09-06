import React from "react";

import { Checkbox, CheckboxProps } from "components/atoms/Checkbox";

export interface TogglerProps
  extends Omit<CheckboxProps, "toggler" | "checked" | "defaultChecked"> {
  toggled?: boolean;
  defaultToggled?: boolean;
}

export const Toggler: React.FC<TogglerProps> = ({
  toggled,
  defaultToggled,
  ...extraProps
}) => (
  <Checkbox
    {...extraProps}
    toggler
    defaultChecked={defaultToggled}
    checked={toggled}
  />
);

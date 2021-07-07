import React, { ChangeEventHandler } from "react";

import { Checkbox, CheckboxProps } from "components/atoms/Checkbox";

export interface TogglerProps extends CheckboxProps {
  defaultToggled: boolean;
  onToggle: ChangeEventHandler<HTMLInputElement>;
  containerClassName?: string;
}

export const Toggler: React.FC<TogglerProps> = ({
  defaultToggled,
  onToggle,
  containerClassName,
  ...extraTogglerProps
}) => (
  <Checkbox
    {...other}
    containerClassName={containerClassName}
    defaultChecked={defaultToggled}
    onChange={onToggle}
    toggler
  />
);

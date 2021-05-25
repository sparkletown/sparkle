import React, { ChangeEventHandler } from "react";

import { Checkbox } from "components/atoms/Checkbox";

export interface TogglerProps {
  defaultToggled: boolean;
  onToggle: ChangeEventHandler<HTMLInputElement>;
  containerClassName?: string;
}

export const Toggler: React.FC<TogglerProps> = ({
  defaultToggled,
  onToggle,
  containerClassName = "",
}) => (
  <Checkbox
    containerClassName={containerClassName}
    defaultChecked={defaultToggled}
    onChange={onToggle}
    toggler
  />
);

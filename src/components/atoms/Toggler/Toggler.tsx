import React from "react";

import { Checkbox } from "../Checkbox";

export interface TogglerProps {
  toggled: boolean;
  onChange: () => void;
  containerClassName?: string;
}

export const Toggler: React.FC<TogglerProps> = ({
  toggled,
  onChange,
  containerClassName = "",
}) => {
  return (
    <Checkbox
      containerClassName={containerClassName}
      defaultChecked={toggled}
      onChange={onChange}
      toggler
    />
  );
};

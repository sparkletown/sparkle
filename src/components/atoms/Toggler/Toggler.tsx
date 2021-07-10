import React from "react";

import { Checkbox, CheckboxProps } from "components/atoms/Checkbox";

export const Toggler: React.FC<CheckboxProps> = ({
  toggler = true,
  ...extraTogglerProps
}) => <Checkbox {...extraTogglerProps} toggler />;

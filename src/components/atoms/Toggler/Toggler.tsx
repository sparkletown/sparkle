import React from "react";
import { Form } from "react-bootstrap";

import { Checkbox, CheckboxProps } from "components/atoms/Checkbox";

export interface TogglerProps
  extends Omit<CheckboxProps, "toggler" | "checked" | "defaultChecked"> {
  toggled?: boolean;
  title?: string;
  titleClassName?: string;
  defaultToggled?: boolean;
}

export const Toggler: React.FC<TogglerProps> = ({
  toggled,
  title,
  titleClassName,
  defaultToggled,
  ...extraProps
}) => (
  <>
    {title && <Form.Label className={titleClassName}>{title}</Form.Label>}
    <Checkbox
      {...extraProps}
      toggler
      defaultChecked={defaultToggled}
      checked={toggled}
    />
  </>
);

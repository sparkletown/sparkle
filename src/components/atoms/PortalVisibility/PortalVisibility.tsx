import React from "react";
import { useForm } from "react-hook-form";
import classNames from "classnames";

import { LABEL_VISIBILITY_OPTIONS } from "settings";

import "./PortalVisibility.scss";

interface PortalVisibilityProps {
  register: ReturnType<typeof useForm>["register"];
  className: string;
}

export const labelOptions = LABEL_VISIBILITY_OPTIONS.map((option) => (
  <option key={option.label} value={option.value}>
    {option.label}
  </option>
));

export const PortalVisibility: React.FC<PortalVisibilityProps> = ({
  className,
  register,
}) => (
  <select
    name="visibility"
    id="visibility"
    ref={register}
    className={classNames("PortalVisibility", className)}
  >
    {labelOptions}
  </select>
);

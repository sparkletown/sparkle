import React from "react";
import { useForm } from "react-hook-form";

import { LABEL_VISIBILITY_OPTIONS } from "settings";

import "./PortalVisibility.scss";

export interface PortalVisibilityProps {
  name?: string;
  register: ReturnType<typeof useForm>["register"];
}

export const labelOptions = LABEL_VISIBILITY_OPTIONS.map((option) => (
  <option key={option.label} value={option.value}>
    {option.label}
  </option>
));

export const PortalVisibility: React.FC<PortalVisibilityProps> = ({
  name = "visibility",
  register,
}) => (
  <select name={name} ref={register} className="PortalVisibility">
    {labelOptions}
  </select>
);

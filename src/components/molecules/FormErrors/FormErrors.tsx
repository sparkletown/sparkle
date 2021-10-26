import React from "react";
import { FieldErrors } from "react-hook-form";
import { omit } from "lodash";

import { AdminSidebarSectionTitle } from "components/organisms/AdminVenueView/components/AdminSidebarSectionTitle";

import "./FormErrors.scss";

export interface FormErrorsProps {
  errors?: FieldErrors<object>;
  omitted?: string[];
}

export const FormErrors: React.FC<FormErrorsProps> = ({ errors, omitted }) => {
  const entries = Object.entries(
    omitted ? omit(errors, omitted) : errors ?? {}
  );

  if (entries.length === 0) {
    return null;
  }

  // NOTE: write to console in case the error has no message or is of unexpected shape (like indexed array)
  console.error("FormErrors:", errors);

  return (
    <section className="FormErrors">
      <AdminSidebarSectionTitle>Errors:</AdminSidebarSectionTitle>
      <ul className="FormErrors__list">
        {entries.map(([key, e]) => (
          <li className="FormErrors__item" key={key}>
            {e?.message ?? "Unknown error"}
          </li>
        ))}
      </ul>
    </section>
  );
};

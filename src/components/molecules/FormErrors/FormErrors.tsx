import React from "react";
import { FieldErrors } from "react-hook-form";
import { isEmpty } from "lodash";

import { objectEntries, ObjectEntry } from "utils/object";

import { AdminSidebarSectionTitle } from "components/organisms/AdminVenueView/components/AdminSidebarSectionTitle";

import "./FormErrors.scss";

const hasMessage = ([path]: ObjectEntry) => path.endsWith(".message");

const isNotInOmitted = (omitted: string[] = []) => ([path]: ObjectEntry) =>
  omitted.every((prefix) => !path.startsWith(prefix));

export interface FormErrorsProps {
  errors?: FieldErrors<object>;
  omitted?: string[];
}

export const FormErrors: React.FC<FormErrorsProps> = ({ errors, omitted }) => {
  const entries = objectEntries(errors).filter(isNotInOmitted(omitted));

  if (entries.length === 0) {
    return null;
  }

  // NOTE: write to console in case the error has no message or is of unexpected shape (like indexed array)
  console.error("FormErrors:", errors);

  return (
    <section className="FormErrors">
      <AdminSidebarSectionTitle>Errors:</AdminSidebarSectionTitle>
      <ul className="FormErrors__list">
        {entries.filter(hasMessage).map(([key, message]) => (
          <li className="FormErrors__item" data-key={key} key={key}>
            {isEmpty(message) ? "Unknown error" : String(message)}
          </li>
        ))}
      </ul>
    </section>
  );
};

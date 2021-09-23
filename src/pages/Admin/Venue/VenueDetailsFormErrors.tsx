import React from "react";
import { ErrorMessage, FieldErrors } from "react-hook-form";

import { FormValues } from "./VenueDetailsForm";

export type VenueDetailsFormErrorsProps = {
  errors: FieldErrors<FormValues>;
};

export const VenueDetailsFormErrors: React.FC<VenueDetailsFormErrorsProps> = ({
  errors,
}) => {
  const entries = Object.entries(errors);
  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="VenueDetailsFormErrors mod--error">
      <div>One or more errors occurred when saving the form:</div>
      <br />
      {entries.map(([name, value], key) => {
        // NOTE: Unidentified component is producing key with value undefined
        const normalError = name && name !== "undefined";
        return (
          <ul key={key}>
            <li>
              {normalError && (
                <>
                  <span>{`Error in ${name}: `}</span>
                  <ErrorMessage
                    errors={errors}
                    name={name}
                    as="span"
                    key={name}
                  />
                </>
              )}
              {!normalError && (
                <>
                  <div>
                    Unexpected error.
                    <br /> Full technical info:
                  </div>
                  <div>{JSON.stringify(value)}</div>
                </>
              )}
            </li>
          </ul>
        );
      })}
    </div>
  );
};

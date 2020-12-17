import { differenceInYears, parseISO } from "date-fns";
import React from "react";
import { FormFieldProps } from "types/forms";

const validateDateOfBirth = (stringDate: string) => {
  const yearsDifference = differenceInYears(new Date(), parseISO(stringDate));
  return yearsDifference >= 18 && yearsDifference <= 100;
};

export const DateOfBirthField: React.FC<FormFieldProps> = ({
  register,
  error,
}) => (
  <div className="input-group">
    <input
      name="date_of_birth"
      className="input-block input-centered"
      type="date"
      ref={register({ required: true, validate: validateDateOfBirth })}
    />
    <small className="input-info">
      You need to be 18 years old to attend this event. Please confirm your age.
    </small>
    {error && (
      <span className="input-error">
        {error.type === "required" && <>Date of birth is required</>}
        {error.type === "validate" && (
          <div>You need to be at least 18 years of age.</div>
        )}
      </span>
    )}
  </div>
);

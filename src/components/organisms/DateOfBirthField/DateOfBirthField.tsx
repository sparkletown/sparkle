import React from "react";
import { FormFieldProps } from "types/forms";

export const DateOfBirthField: React.FC<FormFieldProps> = ({
  register,
  error,
}) => (
  <div className="input-group">
    <input
      name="date_of_birth"
      className="input-block input-centered"
      type="date"
      ref={register({ required: true })}
    />
    <small className="input-info">You need to be 18 years old to attend this event. Please confirm your age.</small>
    {error && (
      <span className="input-error">
        {error.type === "required" ? (
          <>Date of birth is required</>
        ) : (
          error.message
        )}
      </span>
    )}
  </div>
);

import React from "react";

import { FormFieldProps } from "types/forms";

export const TicketCodeField: React.FC<FormFieldProps> = ({
  register,
  error,
}) => (
  <div className="input-group">
    <input
      className="input-block input-centered"
      type="code"
      placeholder="Ticket Code From Your Email"
      {...register("code", {
        required: true,
      })}
    />
    {error && (
      <span className="input-error">
        {error.type === "required" ? (
          <>Enter the ticket code from your email. The code is required.</>
        ) : (
          error.message
        )}
      </span>
    )}
  </div>
);

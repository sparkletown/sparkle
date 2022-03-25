import React from "react";
import { ErrorBoundaryFallbackProps } from "core/ErrorBoundary";

import "./ErrorReadingUsers.scss";

export const ErrorReadingUsers: React.FC<ErrorBoundaryFallbackProps> = (
  props
) => {
  const message = props.error?.message;
  return (
    <span className="ErrorReadingUsers">
      An error has occurred while reading the users
      {message ? ": " + message : ""}
    </span>
  );
};

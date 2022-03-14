import React from "react";

import { isFirebaseError } from "types/errors";

import { AdminSidebarSectionTitle } from "components/organisms/AdminVenueView/components/AdminSidebarSectionTitle";

import "./SubmitError.scss";

export interface SubmitErrorProps {
  error: Error | unknown;
}

const extractErrorDetails: (
  error?: Error | unknown
) => {
  message: string;
  code?: string;
  serverResponse?: string;
} = (error) => {
  if (!(error instanceof Error)) {
    return { message: String(error) };
  }

  const message = error?.message || "Unknown error has occurred";

  if (isFirebaseError(error)) {
    const { code, customData, _baseMessage: baseMessage } = error;
    return {
      code,
      message: baseMessage || message,
      serverResponse: customData?.serverResponse,
    };
  }

  return { message };
};

export const SubmitError: React.FC<SubmitErrorProps> = ({ error }) => {
  if (!error) {
    return null;
  }

  // TODO: Additionally or instead, supply this to Bugsnag with proper admin context added
  console.error("SubmitError", error);

  const { message } = extractErrorDetails(error);

  return (
    <section className="SubmitError">
      <AdminSidebarSectionTitle>Error:</AdminSidebarSectionTitle>
      <p className="SubmitError__message">{message}</p>
    </section>
  );
};

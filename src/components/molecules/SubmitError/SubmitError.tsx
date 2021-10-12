import React from "react";

import { AdminSidebarSectionTitle } from "components/organisms/AdminVenueView/components/AdminSidebarSectionTitle";

import "./SubmitError.scss";

export interface SubmitErrorProps {
  error: Error | unknown;
}

export const SubmitError: React.FC<SubmitErrorProps> = ({ error }) => {
  if (!error) {
    return null;
  }

  // TODO: Additionally or instead, supply this to Bugsnag with proper admin context added
  console.error("SubmitError", error);

  const message =
    error instanceof Error
      ? error?.message ?? "Unknown error has occurred"
      : String(error);

  return (
    <section className="SubmitError">
      <AdminSidebarSectionTitle>Error:</AdminSidebarSectionTitle>
      <p className="SubmitError__message">{message}</p>
    </section>
  );
};

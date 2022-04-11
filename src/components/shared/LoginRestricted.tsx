import React, { ReactNode } from "react";
import { Redirect, useHistory } from "react-router-dom";

import { SIGN_IN_URL } from "settings";

import { useUserId } from "hooks/user/useUserId";

import { Loading } from "components/molecules/Loading";
import { LoadingPage } from "components/molecules/LoadingPage";

interface LoginRestrictedProps {
  loading?: "spinner" | "page" | ReactNode;
}

/**
 * This is a simple check and "redirect" component, no styles, just logic
 */
export const LoginRestricted: React.FC<LoginRestrictedProps> = ({
  loading = null,
  children,
}) => {
  const { userId, isLoading } = useUserId();

  const history = useHistory();

  if (isLoading) {
    if (loading === "spinner") return <Loading />;
    if (loading === "page") return <LoadingPage />;
    return <>{loading}</>;
  }

  if (userId) {
    return <>{children}</>;
  }

  return (
    <Redirect
      to={{
        pathname: SIGN_IN_URL,
        search: `?returnUrl=${history.location.pathname}`,
      }}
    />
  );
};

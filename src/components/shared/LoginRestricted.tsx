import React, { lazy, ReactNode } from "react";
import { Redirect, RouteChildrenProps } from "react-router-dom";

import { SIGN_IN_URL } from "settings";

import { tracePromise } from "utils/performance";

import { useUserId } from "hooks/user/useUserId";

import { Loading } from "components/molecules/Loading";
import { LoadingPage } from "components/molecules/LoadingPage";

// NOTE: lazy() is used for code splitting since admin and attendee sides load different style libraries

const LoginWithWorldAndSpace = lazy(() =>
  tracePromise("AppRouter::lazy-import::Login", () =>
    import("pages/auth/Login").then(({ Login }) => ({
      default: Login,
    }))
  )
);

interface LoginRestrictedProps extends RouteChildrenProps {
  loading?: "spinner" | "page" | ReactNode;
}

/**
 * This is a simple check and "redirect" component, no styles, just logic
 */
export const LoginRestricted: React.FC<LoginRestrictedProps> = ({
  loading = null,
  history,
  children,
}) => {
  const { userId, isLoading } = useUserId();

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

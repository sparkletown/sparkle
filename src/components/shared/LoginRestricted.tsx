import React, { lazy, ReactNode } from "react";
import { Unauthorized } from "components/shared/Unauthorized";

import { tracePromise } from "utils/performance";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
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

type LoginRestrictedProps = {
  loading?: "spinner" | "page" | ReactNode;
};

/**
 * This is a simple check and "redirect" component, no styles, just logic
 */
export const LoginRestricted: React.FC<LoginRestrictedProps> = ({
  loading = null,
  children,
}) => {
  const { spaceSlug, worldSlug } = useSpaceParams();
  const { userId, isLoading } = useUserId();

  if (isLoading) {
    if ("spinner" === loading) return <Loading />;
    if ("page" === loading) return <LoadingPage />;
    return <>{loading}</>;
  }

  if (userId) {
    return <>{children}</>;
  }

  if (spaceSlug && worldSlug) {
    return <LoginWithWorldAndSpace />;
  }

  // @debt this component should only redirect to login components, replace the following
  return <Unauthorized />;
};

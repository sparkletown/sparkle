import React, { lazy, ReactNode } from "react";

import { tracePromise } from "utils/performance";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useAdminContextCheck } from "hooks/useAdminContextCheck";
import { useUserId } from "hooks/user/useUserId";

import { Loading } from "components/molecules/Loading";
import { LoadingPage } from "components/molecules/LoadingPage";

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
  const isAdmin = useAdminContextCheck();

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

  if (isAdmin) {
    // @debt this component should only redirect to login components, replace the following text
    return (
      <>
        You are not logged in. Please navigate to an admin URL that contains
        world and space slugs.
      </>
    );
  }

  return (
    // @debt this component should only redirect to login components, replace the following text
    <>
      Sorry, you are not logged in. The login requires world and space slugs in
      the URL. We are working on a better login experience.
    </>
  );
};

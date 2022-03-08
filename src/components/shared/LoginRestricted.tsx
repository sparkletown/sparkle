import React, { lazy, ReactNode } from "react";
import { getAuth } from "firebase/auth";

import { tracePromise } from "utils/performance";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useAdminContextCheck } from "hooks/useAdminContextCheck";
import { useUserId } from "hooks/user/useUserId";

import { Loading } from "components/molecules/Loading";
import { LoadingPage } from "components/molecules/LoadingPage";

const LoginWithWorldAndSpace = lazy(() =>
  tracePromise("AppRouter::lazy-import::Login", () =>
    import("pages/Account/Login").then(({ Login }) => ({
      default: Login,
    }))
  )
);

type LoginRestrictedProps = {
  loading?: "spinner" | "page" | ReactNode;
};

export const LoginRestricted: React.FC<LoginRestrictedProps> = ({
  loading = null,
  children,
}) => {
  const { spaceSlug, worldSlug } = useSpaceParams();
  const { userId, isLoading } = useUserId();
  const isAdmin = useAdminContextCheck();

  // Simple check and "redirect" component, no styles, just logic

  if (isLoading) {
    if ("spinner" === loading) return <Loading />;
    if ("page" === loading) return <LoadingPage />;
    return <>{loading}</>;
  }

  if (userId) {
    // @debt this component should only return the children, remove the logout button
    return (
      <>
        <button
          style={{
            zIndex: 999,
            position: "fixed",
          }}
          onClick={() => getAuth().signOut()}
        >
          LOG OUT
        </button>
        {children}
      </>
    );
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

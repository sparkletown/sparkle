import React, { ReactNode } from "react";
import { Redirect, useHistory } from "react-router-dom";

import { useLiveUser } from "hooks/user/useLiveUser";

import { Loading } from "components/molecules/Loading";
import { LoadingPage } from "components/molecules/LoadingPage";

interface SplashGatedProps {
  loading?: "spinner" | "page" | ReactNode;
}

/**
 * This is a simple check and "redirect" component, no styles, just logic
 */
export const SplashGated: React.FC<SplashGatedProps> = ({
  loading = null,
  children,
}) => {
  const { userId, isLoading } = useLiveUser();

  const isOnboarded = true;

  const history = useHistory();

  if (isLoading) {
    if (loading === "spinner") return <Loading />;
    if (loading === "page") return <LoadingPage />;
    return <>{loading}</>;
  }

  if (!userId || !isOnboarded) {
    return <Redirect to={`${history.location.pathname}/splash`} />;
  }

  return <>{children}</>;
};

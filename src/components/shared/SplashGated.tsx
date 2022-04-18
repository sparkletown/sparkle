import React, { ReactNode } from "react";
import { Redirect, useHistory } from "react-router-dom";

import { ACCOUNT_PROFILE_BASE_URL } from "settings";

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
  const { userId, profile, isLoading } = useLiveUser();

  const isOnboarded = true;

  const history = useHistory();

  if (isLoading) {
    if (loading === "spinner") return <Loading />;
    if (loading === "page") return <LoadingPage />;
    return <>{loading}</>;
  }

  if (userId && (!profile || !profile.partyName || !profile.pictureUrl)) {
    return <Redirect to={ACCOUNT_PROFILE_BASE_URL} />;
  }

  if (!userId || !isOnboarded) {
    return <Redirect to={`${history.location.pathname}/splash`} />;
  }

  return <>{children}</>;
};

import React from "react";
import { AnalyticsCount } from "core/AnalyticsCount";
import { addToBugsnagEventOnError } from "core/bugsnag";
import LogRocket from "logrocket";

import { BUILD_SHA1, LOGROCKET_APP_ID } from "secrets";

import { FireAuthUser } from "types/fire";
import { UserId } from "types/id";
import { Profile } from "types/User";

import { LoadingPage } from "components/molecules/LoadingPage";

if (LOGROCKET_APP_ID) {
  LogRocket.init(LOGROCKET_APP_ID, {
    release: BUILD_SHA1,
  });

  addToBugsnagEventOnError((event) => {
    event.addMetadata("logrocket", "sessionUrl", LogRocket.sessionURL);
  });
}

type AnalyticsCheckProps = {
  auth: FireAuthUser;
  userId: UserId;
  profile?: Profile;
  isAuthLoading: boolean;
};

export const AnalyticsCheck: React.FC<AnalyticsCheckProps> = ({
  auth,
  children,
  isAuthLoading,
  profile,
  userId,
}) => {
  if (isAuthLoading) return <LoadingPage />;
  // if (!userId) return <>NO LOGIN</>;
  if (!userId) return <>{children}</>;

  return (
    <AnalyticsCount auth={auth} userId={userId} profile={profile}>
      {children}
    </AnalyticsCount>
  );
};

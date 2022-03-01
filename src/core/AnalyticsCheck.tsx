import React from "react";
import { AnalyticsCount } from "core/AnalyticsCount";
import { addToBugsnagEventOnError } from "core/BugsnagErrorBoundary";
import LogRocket from "logrocket";

import { BUILD_SHA1, LOGROCKET_APP_ID } from "secrets";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";
import { useUser } from "hooks/useUser";

import { LoadingPage } from "components/molecules/LoadingPage";

if (LOGROCKET_APP_ID) {
  LogRocket.init(LOGROCKET_APP_ID, {
    release: BUILD_SHA1,
  });

  addToBugsnagEventOnError((event) => {
    event.addMetadata("logrocket", "sessionUrl", LogRocket.sessionURL);
  });
}

export const AnalyticsCheck: React.FC = ({ children }) => {
  const { auth, userId, profile, isLoading: isUserLoading } = useUser();
  const { space, isLoading: isSpaceLoading } = useWorldAndSpaceByParams();

  if (isUserLoading || isSpaceLoading) {
    return <LoadingPage />;
  }

  if (!userId || !space) {
    return <>{children}</>;
  }

  return (
    <AnalyticsCount auth={auth} userId={userId} profile={profile} space={space}>
      {children}
    </AnalyticsCount>
  );
};

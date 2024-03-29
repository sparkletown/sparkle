import React from "react";
import { addToBugsnagEventOnError } from "core/BugsnagErrorBoundary";
import { BUILD_SHA1, LOGROCKET_APP_ID } from "env";
import LogRocket from "logrocket";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";
import { useLiveUser } from "hooks/user/useLiveUser";

import { AnalyticsCount } from "./AnalyticsCount";

if (LOGROCKET_APP_ID) {
  LogRocket.init(LOGROCKET_APP_ID, {
    release: BUILD_SHA1,
  });

  addToBugsnagEventOnError((event) => {
    event.addMetadata("logrocket", "sessionUrl", LogRocket.sessionURL);
  });
}

export const AnalyticsCheck: React.FC = ({ children }) => {
  const { auth, userId, profile } = useLiveUser();
  const { space } = useWorldAndSpaceByParams();

  return (
    <AnalyticsCount auth={auth} userId={userId} profile={profile} space={space}>
      {children}
    </AnalyticsCount>
  );
};

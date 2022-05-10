import React, { useEffect } from "react";
import { addToBugsnagEventOnError } from "core/BugsnagErrorBoundary";
import { BUILD_SHA1, LOGROCKET_APP_ID } from "env";
import LogRocket from "logrocket";

import { FireAuthUser } from "types/fire";
import { SpaceWithId, UserId } from "types/id";
import { Profile } from "types/User";

import { useAnalytics } from "hooks/useAnalytics";

if (LOGROCKET_APP_ID) {
  LogRocket.init(LOGROCKET_APP_ID, {
    release: BUILD_SHA1,
  });

  addToBugsnagEventOnError((event) => {
    event.addMetadata("logrocket", "sessionUrl", LogRocket.sessionURL);
  });
}

export type AnalyticsCountProps = {
  auth?: FireAuthUser;
  profile?: Profile;
  space?: SpaceWithId;
  userId?: UserId;
};

export const AnalyticsCount: React.FC<AnalyticsCountProps> = ({
  space,
  userId,
  auth,
  profile,
  children,
}) => {
  const analytics = useAnalytics({ venue: space });

  useEffect(() => void analytics.initAnalytics(), [analytics]);

  useEffect(() => {
    if (!auth || !profile || !userId) return;

    const displayName = auth.displayName || "N/A";
    const email = auth.email || "N/A";
    const name = profile?.partyName;

    if (LOGROCKET_APP_ID) {
      LogRocket.identify(userId, { displayName, email });
    }

    analytics.identifyUser({ email, name });
  }, [analytics, auth, userId, profile]);

  return <>{children}</>;
};

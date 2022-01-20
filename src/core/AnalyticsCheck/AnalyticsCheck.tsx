import React, { useEffect } from "react";
import { WithProfileOutProps } from "components/hocs/db/withProfile";
import { addToBugsnagEventOnError } from "core/bugsnag";
import LogRocket from "logrocket";

import { BUILD_SHA1, LOGROCKET_APP_ID } from "secrets";

import { FireAuthUser } from "types/fire";
import { SpaceWithId, UserId } from "types/id";

import { useAnalytics } from "hooks/useAnalytics";

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
  space: SpaceWithId;
  userId: UserId;
} & WithProfileOutProps;

export const AnalyticsCheck: React.FC<AnalyticsCheckProps> = ({
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

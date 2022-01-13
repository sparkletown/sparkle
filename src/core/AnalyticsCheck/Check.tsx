import React, { useEffect } from "react";
import { AnalyticsCheckRequiredProps } from "core/AnalyticsCheck/props";
import { addToBugsnagEventOnError } from "core/bugsnag";
import LogRocket from "logrocket";

import { BUILD_SHA1, LOGROCKET_APP_ID } from "secrets";

import { useAnalytics } from "hooks/useAnalytics";

import { LoadingPage } from "components/molecules/LoadingPage";

if (LOGROCKET_APP_ID) {
  LogRocket.init(LOGROCKET_APP_ID, {
    release: BUILD_SHA1,
  });

  addToBugsnagEventOnError((event) => {
    event.addMetadata("logrocket", "sessionUrl", LogRocket.sessionURL);
  });
}

export const Check: React.FC<AnalyticsCheckRequiredProps> = ({
  space,
  userId,
  user,
  profile,
  isLoading,
  children,
}) => {
  console.log(Check.name, "rendering...");
  const analytics = useAnalytics({ venue: space });

  useEffect(() => void analytics.initAnalytics(), [analytics]);

  useEffect(() => {
    if (!user || !profile || !userId) return;

    const displayName = user.displayName || "N/A";
    const email = user.email || "N/A";

    if (LOGROCKET_APP_ID) {
      LogRocket.identify(userId, { displayName, email });
    }

    analytics.identifyUser({ email, name: profile?.partyName });
  }, [analytics, user, userId, profile]);

  return isLoading ? <LoadingPage /> : <>{children}</>;
};

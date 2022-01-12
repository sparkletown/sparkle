import React from "react";
import { addToBugsnagEventOnError } from "core/bugsnag";
import LogRocket from "logrocket";

import { BUILD_SHA1, LOGROCKET_APP_ID } from "secrets";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useWorldAndSpaceBySlug } from "hooks/spaces/useWorldAndSpaceBySlug";
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

export const AnalyticsCheck: React.FunctionComponent<
  React.PropsWithChildren<{}>
> = ({ children }) => {
  const slugs = useSpaceParams();
  const { space } = useWorldAndSpaceBySlug(slugs.worldSlug, slugs.spaceSlug);
  // const analytics = useAnalytics({ venue: space });
  const { authError, profileError, user, isLoading } = useUser();

  if (authError || profileError) {
    // @debt use more sophisticated tracking here, like Bugsnag
    console.error(AnalyticsCheck.name, authError, profileError);
  }

  console.log(
    AnalyticsCheck.name,
    "Should ping analytics that",
    user,
    "visited",
    space
  );

  // @temporary DISABLED_DUE_TO_REDUX_FIREBASE_REMOVAL
  // useEffect(() => {
  //   return void analytics.initAnalytics();
  // }, [analytics]);
  //
  // useEffect(() => {
  //   if (!auth || !user) return;
  //
  //   const displayName = auth.displayName || "N/A";
  //   const email = auth.email || "N/A";
  //
  //   if (LOGROCKET_APP_ID) {
  //     LogRocket.identify(auth?.uid, { displayName, email });
  //   }
  //
  //   analytics.identifyUser({ email, name: user?.partyName });
  // }, [analytics, auth, user]);

  if (isLoading) {
    return <LoadingPage />;
  }

  // NOTE: can use the else statement for displaying error or redirecting to login?
  // return authData.signedIn ? <>{children}</> : <>{children}</>;
  return <>{children}</>;
};

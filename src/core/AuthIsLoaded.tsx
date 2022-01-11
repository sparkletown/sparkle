import React, { useEffect } from "react";
import { useSigninCheck } from "reactfire";
import { addToBugsnagEventOnError } from "core/bugsnag";
import LogRocket from "logrocket";

import { BUILD_SHA1, LOGROCKET_APP_ID } from "secrets";

import { currentVenueSelector } from "utils/selectors";

import { useAnalytics } from "hooks/useAnalytics";
import { useSelector } from "hooks/useSelector";
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

export const AuthIsLoaded: React.FunctionComponent<
  React.PropsWithChildren<{}>
> = ({ children }) => {
  // TEMPORARY COMMENT OUT UNTIL redux-firebase is resolved

  // const { userWithId, user } = useUser();
  // const venue = useSelector(currentVenueSelector);
  // const analytics = useAnalytics({ venue });
  // // const auth = useSelector(authSelector);
  // const { status, data } = useSigninCheck();
  //
  // const auth = data?.user;
  // console.log("AIL", { userWithId, venue, analytics, auth, user, data });
  //
  // useEffect(() => {
  //   analytics.initAnalytics();
  // }, [analytics]);
  //
  // useEffect(() => {
  //   console.log("IDENTIFY BGN", auth);
  //   if (!auth) return;
  //
  //   const displayName = auth.displayName || "N/A";
  //   const email = auth.email || "N/A";
  //
  //   if (LOGROCKET_APP_ID) {
  //     LogRocket.identify(auth?.uid, {
  //       displayName,
  //       email,
  //     });
  //   }
  //
  //   analytics.identifyUser({
  //     email,
  //     name: userWithId?.partyName,
  //   });
  // }, [analytics, auth, userWithId]);
  //
  // if (status === "loading") {
  //   return <LoadingPage />;
  // }

  // NOTE: can use the else statement for displaying error or redirecting to login?
  // return signInCheckResult.signedIn ? <>{children}</> : <>{children}</>;
  return <>{children}</>;
};

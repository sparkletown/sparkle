import React from "react";
import { useFirestore, useFirestoreDocData, useSigninCheck } from "reactfire";
import { addToBugsnagEventOnError } from "core/bugsnag";
import { doc } from "firebase/firestore";
import LogRocket from "logrocket";

import { BUILD_SHA1, LOGROCKET_APP_ID } from "secrets";

import { COLLECTION_USERS } from "settings";

import { convertToFirestoreKey } from "utils/id";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useWorldAndSpaceBySlug } from "hooks/spaces/useWorldAndSpaceBySlug";

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
  const { status: authStatus, data: authData } = useSigninCheck();

  const auth = authData?.user;
  const uid = auth?.uid;

  const firestore = useFirestore();

  const {
    status: userStatus,
    data: user,
    error,
  } = useFirestoreDocData(
    doc(firestore, COLLECTION_USERS, convertToFirestoreKey(uid))
  );

  if (error) {
    console.error(AnalyticsCheck.name, error);
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

  if (authStatus === "loading" || userStatus === "loading") {
    return <LoadingPage />;
  }

  // NOTE: can use the else statement for displaying error or redirecting to login?
  // return authData.signedIn ? <>{children}</> : <>{children}</>;
  return <>{children}</>;
};

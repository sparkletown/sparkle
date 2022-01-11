import React from "react";
import { useFirestore, useFirestoreDocData, useSigninCheck } from "reactfire";
import { addToBugsnagEventOnError } from "core/bugsnag";
import { collection, doc } from "firebase/firestore";
import LogRocket from "logrocket";

import { BUILD_SHA1, LOGROCKET_APP_ID } from "secrets";

import { COLLECTION_USERS } from "settings";

import { convertToFirestoreKey } from "utils/id";

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
  // const slugs = { worldSlug: undefined, spaceSlug: undefined };
  // const { space } = useWorldAndSpaceBySlug(slugs.worldSlug, slugs.spaceSlug);
  // const analytics = useAnalytics({ venue: space });
  const { status: authStatus, data: authData } = useSigninCheck();

  const auth = authData?.user;
  const uid = auth?.uid;

  const firestore = useFirestore();
  const usersRef = collection(firestore, COLLECTION_USERS);
  const userRef = doc(usersRef, convertToFirestoreKey(uid));

  const {
    status: userStatus,
    // data: userData,
    error,
  } = useFirestoreDocData(userRef);

  if (error) {
    console.error(AnalyticsCheck.name, error);
  }

  // cant use !DISABLED_DUE_TO_REDUX_FIREBASE_REMOVAL due to useAnalytics being a hook

  // useEffect(() => void analytics.initAnalytics(), [analytics]);
  //
  // useEffect(() => {
  //   if (!auth || !userData) return;
  //
  //   const displayName = auth.displayName || "N/A";
  //   const email = auth.email || "N/A";
  //
  //   if (LOGROCKET_APP_ID) {
  //     LogRocket.identify(auth?.uid, { displayName, email });
  //   }
  //
  //   // analytics.identifyUser({ email, name: userData?.partyName });
  // }, [
  //   // analytics,
  //   auth,
  //   userData,
  // ]);

  if (authStatus === "loading" || userStatus === "loading") {
    return <LoadingPage />;
  }

  // NOTE: can use the else statement for displaying error or redirecting to login?
  // return signInCheckResult.signedIn ? <>{children}</> : <>{children}</>;
  return <>{children}</>;
};

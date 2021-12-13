import React, { useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { render } from "react-dom";
import { Provider as ReduxStoreProvider } from "react-redux";
import { isLoaded, ReactReduxFirebaseProvider } from "react-redux-firebase";
import { FirebaseAppProvider } from "reactfire";
import { addToBugsnagEventOnError, BugsnagErrorBoundary } from "bugsnag";
import firebase from "firebase/app";
import LogRocket from "logrocket";
// eslint-disable-next-line no-restricted-imports
import { activatePolyFills } from "polyfills";
import { createFirestoreInstance } from "redux-firestore";

import { BUILD_SHA1, LOGROCKET_APP_ID } from "secrets";

import { FIREBASE_CONFIG } from "settings";

import { store } from "store";

import { traceReactScheduler } from "utils/performance";
import { authSelector, currentVenueSelector } from "utils/selectors";

import { AlgoliaSearchProvider } from "hooks/algolia/context";
import { CustomSoundsProvider } from "hooks/sounds";
import { useAnalytics } from "hooks/useAnalytics";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";

import { AppRouter } from "components/organisms/AppRouter";

import { LoadingPage } from "components/molecules/LoadingPage/LoadingPage";

import "./wdyr";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import "firebase/performance";

import * as serviceWorker from "./serviceWorker";

import "scss/global.scss";

activatePolyFills();

if (LOGROCKET_APP_ID) {
  LogRocket.init(LOGROCKET_APP_ID, {
    release: BUILD_SHA1,
  });

  addToBugsnagEventOnError((event) => {
    event.addMetadata("logrocket", "sessionUrl", LogRocket.sessionURL);
  });
}

const firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
firebaseApp.analytics();
firebaseApp.auth();
firebaseApp.firestore();
const firebaseFunctions = firebase.functions();
firebase.performance();

// Enable the functions emulator when running in development
if (process.env.NODE_ENV === "development") {
  firebaseFunctions.useFunctionsEmulator("http://localhost:5001");
}

const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true,
};

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance,
};

const AuthIsLoaded: React.FunctionComponent<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const { userWithId } = useUser();
  const venue = useSelector(currentVenueSelector);
  const analytics = useAnalytics({ venue });
  const auth = useSelector(authSelector);

  useEffect(() => {
    analytics.initAnalytics();
  }, [analytics]);

  useEffect(() => {
    if (!auth || !auth.uid || !userWithId) return;

    const displayName = auth.displayName || "N/A";
    const email = auth.email || "N/A";

    if (LOGROCKET_APP_ID) {
      LogRocket.identify(auth.uid, {
        displayName,
        email,
      });
    }

    analytics.identifyUser({
      email,
      name: userWithId.partyName,
    });
  }, [analytics, auth, userWithId]);

  if (!isLoaded(auth)) return <LoadingPage />;

  return <>{children}</>;
};

traceReactScheduler("initial render", performance.now(), () => {
  render(
    <BugsnagErrorBoundary>
      <DndProvider backend={HTML5Backend}>
        <ReduxStoreProvider store={store}>
          <FirebaseAppProvider firebaseApp={firebaseApp}>
            <ReactReduxFirebaseProvider {...rrfProps}>
              <AuthIsLoaded>
                <AlgoliaSearchProvider>
                  <CustomSoundsProvider
                    loadingComponent={<LoadingPage />}
                    waitTillConfigLoaded
                  >
                    <AppRouter />
                  </CustomSoundsProvider>
                </AlgoliaSearchProvider>
              </AuthIsLoaded>
            </ReactReduxFirebaseProvider>
          </FirebaseAppProvider>
        </ReduxStoreProvider>
      </DndProvider>
    </BugsnagErrorBoundary>,
    document.getElementById("root")
  );
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

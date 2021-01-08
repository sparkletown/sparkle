import "./wdyr";

import React, { useEffect } from "react";
import Bugsnag from "@bugsnag/js";
import BugsnagPluginReact from "@bugsnag/plugin-react";
import LogRocket from "logrocket";
// eslint-disable-next-line no-restricted-imports
import mixpanel from "mixpanel-browser";

import { render } from "react-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";

import { createStore, combineReducers, applyMiddleware, Reducer } from "redux";
import thunkMiddleware from "redux-thunk";
import { createFirestoreInstance, firestoreReducer } from "redux-firestore";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/analytics";
import "firebase/auth";
import "firebase/functions";
import {
  ReactReduxFirebaseProvider,
  firebaseReducer,
  isLoaded,
  FirebaseReducer,
} from "react-redux-firebase";
import { composeWithDevTools } from "redux-devtools-extension";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import {
  BUGSNAG_API_KEY,
  BUILD_BRANCH,
  BUILD_PULL_REQUESTS,
  BUILD_SHA1,
  BUILD_TAG,
  LOGROCKET_APP_ID,
  MIXPANEL_PROJECT_TOKEN,
  STRIPE_PUBLISHABLE_KEY,
} from "secrets";
import { FIREBASE_CONFIG } from "settings";

import { VenueTemplateReducers, MiscReducers } from "store/reducers";
import * as serviceWorker from "./serviceWorker";
import { activatePolyFills } from "./polyfills";

import { Firestore } from "types/Firestore";
import { User } from "types/User";

import { useSelector } from "hooks/useSelector";
import { authSelector } from "utils/selectors";
import { initializeZendesk } from "utils/zendesk";

import AppRouter from "components/organisms/AppRouter";

import { LoadingPage } from "components/molecules/LoadingPage/LoadingPage";

import "bootstrap";
import "scss/global.scss";

activatePolyFills();
initializeZendesk();

if (LOGROCKET_APP_ID) {
  LogRocket.init(LOGROCKET_APP_ID, {
    release: BUILD_SHA1,
  });

  Bugsnag.addOnError((event) => {
    event.addMetadata("logrocket", "sessionUrl", LogRocket.sessionURL);
  });
}

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY ?? "");

const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true,
  oneListenerPerPath: true,
  allowMultipleListeners: false,
};

firebase.initializeApp(FIREBASE_CONFIG);
firebase.analytics();
firebase.auth();
firebase.firestore();

if (window.location.hostname === "localhost") {
  firebase.functions().useFunctionsEmulator("http://localhost:5001");
} else {
  firebase.functions();
}

// Add firebase to reducers
const rootReducer = combineReducers({
  firebase: firebaseReducer as Reducer<FirebaseReducer.Reducer<User>>,
  firestore: firestoreReducer as Reducer<Firestore>,
  ...VenueTemplateReducers,
  ...MiscReducers,
});

export type RootState = ReturnType<typeof rootReducer>;

const initialState = {};
const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(
    applyMiddleware(
      thunkMiddleware,
      LogRocket.reduxMiddleware() // logrocket needs to be last
    )
  )
);

export type AppDispatch = typeof store.dispatch;

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance,
};

if (BUGSNAG_API_KEY) {
  const DEVELOPMENT = "development";
  const TEST = "test";
  const STAGING = "staging";
  const PRODUCTION = "production";
  const SPARKLE_ENVS = [
    "sparkleverse",
    "sparkle1",
    "sparkle2",
    "sparkle3",
    "sparkle4",
    "sparkle5",
    "sparkle6",
    "sparkle7",
    "sparkle8",
    "sparkle9",
    "sparkle10",
  ];

  const releaseStage = () => {
    if (
      window.location.host.includes("localhost") ||
      process.env.NODE_ENV === DEVELOPMENT
    ) {
      return DEVELOPMENT;
    }

    if (process.env.NODE_ENV === TEST) {
      return TEST;
    }

    if (
      window.location.host.includes(STAGING) ||
      BUILD_BRANCH?.includes(STAGING)
    ) {
      return STAGING;
    }

    if (BUILD_BRANCH?.includes("master")) {
      return PRODUCTION;
    }

    if (BUILD_BRANCH !== undefined && SPARKLE_ENVS.includes(BUILD_BRANCH)) {
      return BUILD_BRANCH;
    }

    return process.env.NODE_ENV;
  };

  Bugsnag.start({
    apiKey: BUGSNAG_API_KEY,
    plugins: [new BugsnagPluginReact()],
    appType: "client",
    appVersion: BUILD_SHA1,
    enabledReleaseStages: [STAGING, PRODUCTION, ...SPARKLE_ENVS], // don't track errors in development/test
    releaseStage: releaseStage(),
    maxEvents: 25,
    metadata: {
      BUILD_SHA1,
      BUILD_TAG,
      BUILD_BRANCH,
      BUILD_PULL_REQUESTS,
    },
    onError: (event) => {
      const { currentUser } = firebase.auth();

      if (!currentUser) return;

      // Add user context to help locate related errors for support
      event.setUser(
        currentUser.uid,
        currentUser.email || undefined,
        currentUser.displayName || undefined
      );
    },
  });
}

// When BUGSNAG_API_KEY not set, stub out BugsnagErrorBoundary with a noop
const BugsnagErrorBoundary = BUGSNAG_API_KEY
  ? Bugsnag.getPlugin("react")?.createErrorBoundary(React) ?? React.Fragment
  : React.Fragment;

if (MIXPANEL_PROJECT_TOKEN) {
  mixpanel.init(MIXPANEL_PROJECT_TOKEN, { batch_requests: true });
}

const AuthIsLoaded: React.FunctionComponent<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const auth = useSelector(authSelector);

  useEffect(() => {
    if (!auth || !auth.uid) return;

    const displayName = auth.displayName || "N/A";
    const email = auth.email || "N/A";

    if (LOGROCKET_APP_ID) {
      LogRocket.identify(auth.uid, {
        displayName,
        email,
      });
    }

    if (MIXPANEL_PROJECT_TOKEN) {
      mixpanel.identify(email);
    }
  }, [auth]);

  if (!isLoaded(auth)) return <LoadingPage />;

  return <>{children}</>;
};

render(
  <BugsnagErrorBoundary>
    <ThemeProvider theme={{}}>
      <Elements stripe={stripePromise}>
        <DndProvider backend={HTML5Backend}>
          <Provider store={store}>
            <ReactReduxFirebaseProvider {...rrfProps}>
              <AuthIsLoaded>
                <AppRouter />
              </AuthIsLoaded>
            </ReactReduxFirebaseProvider>
          </Provider>
        </DndProvider>
      </Elements>
    </ThemeProvider>
  </BugsnagErrorBoundary>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

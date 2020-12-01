import "./wdyr";

import React from "react";
import Bugsnag from "@bugsnag/js";
import BugsnagPluginReact from "@bugsnag/plugin-react";

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
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import { BUGSNAG_API_KEY, STRIPE_PUBLISHABLE_KEY } from "secrets";

import "bootstrap";
import "scss/global.scss";

import AppRouter from "components/organisms/AppRouter";

import { VenueTemplateReducers, MiscReducers } from "store/reducers";
import trackingMiddleware from "./middleware/tracking";
import * as serviceWorker from "./serviceWorker";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSelector } from "hooks/useSelector";
import { Firestore } from "types/Firestore";
import { User } from "types/User";

import { LoadingPage } from "components/molecules/LoadingPage/LoadingPage";
import { FIREBASE_CONFIG } from "settings";

Bugsnag.start({
  apiKey: BUGSNAG_API_KEY ?? "",
  plugins: [new BugsnagPluginReact()],
});

const BugsnagErrorBoundary = Bugsnag?.getPlugin("react")?.createErrorBoundary(
  React
);

if (!BugsnagErrorBoundary) {
  throw new Error("failed to create BugsnagErrorBoundary");
}

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY ?? "");

const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true,
};

firebase.initializeApp(FIREBASE_CONFIG);
const analytics = firebase.analytics();
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
    applyMiddleware(thunkMiddleware, trackingMiddleware(analytics))
  )
);

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance,
};

const AuthIsLoaded: React.FunctionComponent<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const auth = useSelector((state) => state.firebase.auth);
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

import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";

import { createStore, compose, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { reduxFirestore, createFirestoreInstance } from "redux-firestore";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/analytics";
import "firebase/auth";
import "firebase/functions";
import { ReactReduxFirebaseProvider } from "react-redux-firebase";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import { STRIPE_PUBLISHABLE_KEY } from "secrets";

import "bootstrap";
import "scss/global.scss";

import AppRouter from "components/organisms/AppRouter";

import rootReducer from "./reducers/";
import trackingMiddleware from "./middleware/tracking";
import {
  API_KEY,
  APP_ID,
  MEASUREMENT_ID,
  BUCKET_URL,
  PROJECT_ID,
} from "./secrets";
import * as serviceWorker from "./serviceWorker";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const firebaseConfig = {
  apiKey: API_KEY,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
  projectId: PROJECT_ID,
  storageBucket: BUCKET_URL,
};
const rfConfig = {}; // optional redux-firestore Config Options

const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true,
};

firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics();
firebase.auth();

if (window.location.hostname === "localhost") {
  firebase.functions().useFunctionsEmulator("http://localhost:5000");
} else {
  firebase.functions();
}

const createStoreWithFirebase = compose(reduxFirestore(firebase, rfConfig))(
  createStore
);

const initialState = {};
const store = createStoreWithFirebase(
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

render(
  <Elements stripe={stripePromise}>
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <AppRouter />
      </ReactReduxFirebaseProvider>
    </Provider>
  </Elements>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

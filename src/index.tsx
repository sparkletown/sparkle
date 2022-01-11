import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { render } from "react-dom";
import { Provider as ReduxStoreProvider } from "react-redux";
import { ReactReduxFirebaseProvider } from "react-redux-firebase";
import {
  AuthProvider,
  DatabaseProvider,
  FirebaseAppProvider,
  FirestoreProvider,
} from "reactfire";
import { AuthIsLoaded } from "core/AuthIsLoaded";
import { BugsnagErrorBoundary } from "core/bugsnag";
import { FIREBASE, REACT_REDUX_FIREBASE_CONFIG } from "core/firebase";
import { activatePolyFills } from "core/polyfills";
import { connectFunctionsEmulator } from "firebase/functions";
import { ThemeProvider } from "styled-components";

import { store } from "store";

import { traceReactScheduler } from "utils/performance";

import { AlgoliaSearchProvider } from "hooks/algolia/context";
import { CustomSoundsProvider } from "hooks/sounds";

import { AppRouter } from "components/organisms/AppRouter";

import { LoadingPage } from "components/molecules/LoadingPage/LoadingPage";

import "./wdyr";

import * as serviceWorker from "./serviceWorker";

import { theme } from "theme/theme";

import "scss/global.scss";

activatePolyFills();

// Enable the functions emulator when running in development
if (process.env.NODE_ENV === "development") {
  connectFunctionsEmulator(FIREBASE.functions, "localhost", 5001);
}

traceReactScheduler("initial render", window.performance.now(), () => {
  render(
    <BugsnagErrorBoundary>
      <ThemeProvider theme={theme}>
        <DndProvider backend={HTML5Backend}>
          <ReduxStoreProvider store={store}>
            <FirebaseAppProvider firebaseApp={FIREBASE.app}>
              <ReactReduxFirebaseProvider {...REACT_REDUX_FIREBASE_CONFIG}>
                <FirestoreProvider sdk={FIREBASE.firestore}>
                  <AuthProvider sdk={FIREBASE.auth}>
                    <DatabaseProvider sdk={FIREBASE.db}>
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
                    </DatabaseProvider>
                  </AuthProvider>
                </FirestoreProvider>
              </ReactReduxFirebaseProvider>
            </FirebaseAppProvider>
          </ReduxStoreProvider>
        </DndProvider>
      </ThemeProvider>
    </BugsnagErrorBoundary>,
    document.getElementById("root")
  );
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { render } from "react-dom";
import { Provider as ReduxStoreProvider } from "react-redux";
import {
  AuthProvider,
  DatabaseProvider,
  FirebaseAppProvider,
  FirestoreProvider,
} from "reactfire";
import { AppRouter } from "core/AppRouter";
import { BugsnagErrorBoundary } from "core/BugsnagErrorBoundary";
import { FIREBASE } from "core/firebase";
import { activatePolyFills } from "core/polyfills";
import { SPARK } from "core/spark";

import { PLATFORM_BRAND_NAME } from "settings";

import { store } from "store";

import { traceReactScheduler } from "utils/performance";

import { AlgoliaSearchProvider } from "hooks/algolia/context";
import { CustomSoundsProvider } from "hooks/sounds";

import { LoadingPage } from "components/molecules/LoadingPage/LoadingPage";

import "./wdyr";

import * as serviceWorker from "./serviceWorker";

import "normalize.css";

activatePolyFills();

traceReactScheduler("initial render", window.performance.now(), () => {
  const element: JSX.Element = (
    <React.StrictMode>
      <BugsnagErrorBoundary>
        <DndProvider backend={HTML5Backend}>
          <ReduxStoreProvider store={store}>
            <FirebaseAppProvider firebaseApp={FIREBASE.app}>
              <FirestoreProvider sdk={FIREBASE.firestore}>
                <AuthProvider sdk={FIREBASE.auth}>
                  <DatabaseProvider sdk={FIREBASE.db}>
                    <AlgoliaSearchProvider>
                      <CustomSoundsProvider
                        loadingComponent={<LoadingPage />}
                        waitTillConfigLoaded
                      >
                        <AppRouter />
                      </CustomSoundsProvider>
                    </AlgoliaSearchProvider>
                  </DatabaseProvider>
                </AuthProvider>
              </FirestoreProvider>
            </FirebaseAppProvider>
          </ReduxStoreProvider>
        </DndProvider>
      </BugsnagErrorBoundary>
    </React.StrictMode>
  );

  render(element, document.getElementById("root"));

  // NOTE, this message also makes sure the SPARK global is created at proper time
  console.log(
    "Welcome to",
    PLATFORM_BRAND_NAME,
    "Made with ❤️️, powered by ✨",
    SPARK.version()
  );
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

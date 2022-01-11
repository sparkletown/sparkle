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
import { AnalyticsCheck } from "core/AnalyticsCheck";
import { BugsnagErrorBoundary } from "core/bugsnag";
import { FIREBASE } from "core/firebase";
import { activatePolyFills } from "core/polyfills";
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

traceReactScheduler("initial render", window.performance.now(), () => {
  render(
    <BugsnagErrorBoundary>
      <ThemeProvider theme={theme}>
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
                        <AnalyticsCheck>
                          <AppRouter />
                        </AnalyticsCheck>
                      </CustomSoundsProvider>
                    </AlgoliaSearchProvider>
                  </DatabaseProvider>
                </AuthProvider>
              </FirestoreProvider>
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

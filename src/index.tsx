import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { render } from "react-dom";
import { Provider as ReduxStoreProvider } from "react-redux";
import { AppRouter } from "core/AppRouter";
import { BugsnagErrorBoundary } from "core/BugsnagErrorBoundary";
import { activatePolyFills } from "core/polyfills";

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
            <AlgoliaSearchProvider>
              <CustomSoundsProvider
                loadingComponent={<LoadingPage />}
                waitTillConfigLoaded
              >
                <AppRouter />
              </CustomSoundsProvider>
            </AlgoliaSearchProvider>
          </ReduxStoreProvider>
        </DndProvider>
      </BugsnagErrorBoundary>
    </React.StrictMode>
  );

  render(element, document.getElementById("root"));
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

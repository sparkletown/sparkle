import { configureStore, combineReducers, Reducer } from "@reduxjs/toolkit";
import { FirebaseReducer, firebaseReducer } from "react-redux-firebase";
import { firestoreReducer } from "redux-firestore";
import LogRocket from "logrocket";

import { Firestore } from "types/Firestore";
import { User } from "types/User";

import { MiscReducers, VenueTemplateReducers } from "./reducers";

export const rootReducer = combineReducers({
  firebase: firebaseReducer as Reducer<FirebaseReducer.Reducer<User>>,
  firestore: firestoreReducer as Reducer<Firestore>,
  ...VenueTemplateReducers,
  ...MiscReducers,
});

export const initialState: Readonly<{}> = {};

/**
 * Configure the Redux store along with any associated middleware, enhancers, etc.
 *
 * @see https://redux-toolkit.js.org/api/configureStore
 */
export const store = configureStore({
  /**
   * @see https://redux-toolkit.js.org/api/configureStore#reducer
   */
  reducer: rootReducer,

  /**
   * @see https://redux-toolkit.js.org/api/configureStore#preloadedstate
   */
  preloadedState: initialState,

  /**
   * Note: It is preferable to use the chainable .concat(...) and .prepend(...) methods of the returned MiddlewareArray
   * instead of the array spread operator, as the latter can lose valuable type information under some circumstances.
   *
   * @see https://redux-toolkit.js.org/api/configureStore#middleware
   * @see https://docs.logrocket.com/reference#customizing-reduxmiddleware
   */
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      // Note: LogRocket middleware needs to be last to be able to capture everything correctly
      // (though if we want to add middleware profiling checks, they should probably be after LogRocket)
      LogRocket.reduxMiddleware()
    ),

  /**
   * @see https://redux-toolkit.js.org/api/configureStore#devtools
   */
  devTools: true,
});

// Infer the RootState and AppDispatch types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

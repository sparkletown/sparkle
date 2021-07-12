import { applyMiddleware, combineReducers, createStore, Reducer } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import { FirebaseReducer, firebaseReducer } from "react-redux-firebase";
import { firestoreReducer } from "redux-firestore";
import { reduxMiddleware as logrocketReduxMiddleware } from "logrocket";

import { Firestore } from "types/Firestore";
import { User } from "types/User";

import { MiscReducers, VenueTemplateReducers } from "./reducers";

export const rootReducer = combineReducers({
  firebase: firebaseReducer as Reducer<FirebaseReducer.Reducer<User>>,
  firestore: firestoreReducer as Reducer<Firestore>,
  ...VenueTemplateReducers,
  ...MiscReducers,
});

export type RootState = ReturnType<typeof rootReducer>;

export const initialState: Readonly<{}> = {};

export const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(
    applyMiddleware(
      thunkMiddleware,
      logrocketReduxMiddleware() // logrocket needs to be last
    )
  )
);

export type AppDispatch = typeof store.dispatch;

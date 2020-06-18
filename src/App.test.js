// import React from "react";
// import ReactDOM from "react-dom";
// import { Provider } from "react-redux";
// import { BrowserRouter as Router, Route } from "react-router-dom";

// import { createStore, compose, applyMiddleware } from "redux";
// import thunkMiddleware from "redux-thunk";
// import { reduxFirestore, createFirestoreInstance } from "redux-firestore";
// import firebase from "firebase/app";
// import "firebase/firestore";
// import "firebase/auth";
// import { ReactReduxFirebaseProvider } from "react-redux-firebase";
// import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";

// import "bootstrap";
// import "./scss/global.scss";

// import App from "./App";
// import rootReducer from "./reducers/";
// import trackingMiddleware from "./middleware/tracking";
// import { API_KEY, APP_ID, MEASUREMENT_ID } from "./secrets";
// import * as serviceWorker from "./serviceWorker";

it("renders with minimal dependencies", () => {
  // const div = document.createElement("div");

  // const firebaseConfig = {
  //   apiKey: API_KEY,
  //   appId: APP_ID,
  //   measurementId: MEASUREMENT_ID,
  //   projectId: "co-reality-map",
  // };
  // const rfConfig = {}; // optional redux-firestore Config Options

  // const rrfConfig = {
  //   userProfile: "users",
  //   useFirestoreForProfile: true,
  // };

  // firebase.initializeApp(firebaseConfig);
  // firebase.auth();

  // const createStoreWithFirebase = compose(reduxFirestore(firebase, rfConfig))(
  //   createStore
  // );

  // const initialState = {};
  // const store = createStoreWithFirebase(
  //   rootReducer,
  //   initialState,
  //   composeWithDevTools(applyMiddleware(thunkMiddleware))
  // );

  // const rrfProps = {
  //   firebase,
  //   config: rrfConfig,
  //   dispatch: store.dispatch,
  //   createFirestoreInstance,
  // };

  // ReactDOM.render(
  //   <Provider store={store}>
  //     <ReactReduxFirebaseProvider {...rrfProps}>
  //       <Router>
  //         <Route path="/" component={App} />
  //       </Router>
  //     </ReactReduxFirebaseProvider>
  //   </Provider>,
  //   div
  // );
});

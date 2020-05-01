import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { createStore, combineReducers, compose } from 'redux';
import { reduxFirestore, firestoreReducer, createFirestoreInstance } from 'redux-firestore';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase'

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App';
import * as serviceWorker from './serviceWorker';

const firebaseConfig = {projectId: 'co-reality-map'};
const rfConfig = {}; // optional redux-firestore Config Options

const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true
}

firebase.initializeApp(firebaseConfig);

const createStoreWithFirebase = compose(
	reduxFirestore(firebase, rfConfig),
)(createStore);

const rootReducer = combineReducers({
	firestore: firestoreReducer,
})

const initialState = {};
const store = createStoreWithFirebase(
	rootReducer,
	initialState,
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance
}

render(
  <Provider store={store}>
  	<ReactReduxFirebaseProvider {...rrfProps}>
    	<App />
	</ReactReduxFirebaseProvider>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

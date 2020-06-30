import React, { useEffect } from "react";
import Register from "pages/Account/Register";
import Profile from "pages/Account/Profile";
import Questions from "pages/Account/Questions";
import CodeOfConduct from "pages/Account/CodeOfConduct";
import Login from "pages/Account/Login";
import App from "App";
import EditProfilePage from "pages/EditProfilePage";
import { useDispatch, useSelector } from "react-redux";
import { useFirebase, useFirestoreConnect } from "react-redux-firebase";
import { setUser } from "actions";
import { PARTY_NAME } from "config";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SparkleSpaceMarketingPage from "pages/SparkleSpaceMarketingPage";

const AppRouter = () => {
  const firebase = useFirebase();
  const dispatch = useDispatch();
  useFirestoreConnect([{ collection: "config", doc: PARTY_NAME }, "users"]);
  const { config } = useSelector((state) => ({
    config:
      state.firestore.data.config && state.firestore.data.config[PARTY_NAME],
  }));

  // REVISIT: properly wrap dependencies in useRef per https://github.com/facebook/create-react-app/issues/6880
  useEffect(() => {
    const killLoginsFromBeforePartyStart = (user) => {
      if (user && config) {
        const partyHasStarted = new Date() / 1000 >= config.start_utc_seconds;
        const lastSignInTimeSeconds =
          new Date(user.metadata.lastSignInTime) / 1000;
        const signedInBeforePartyStart =
          lastSignInTimeSeconds < config.start_utc_seconds;

        if (partyHasStarted && signedInBeforePartyStart) {
          firebase.auth().signOut();
        }
      }
    };

    firebase.auth().onAuthStateChanged((user) => {
      dispatch(setUser(user));
      killLoginsFromBeforePartyStart(user);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  return (
    <Router basename="/">
      <Switch>
        <Route path="/SparkleVerse" component={SparkleSpaceMarketingPage} />
        <Route path="/account/register" component={Register} />
        <Route path="/account/profile" component={Profile} />
        <Route path="/account/questions" component={Questions} />
        <Route path="/account/code-of-conduct" component={CodeOfConduct} />
        <Route path="/login" component={Login} />
        <Route path="/account/edit" component={EditProfilePage} />
        <Route path="/" component={App} />
      </Switch>
    </Router>
  );
};

export default AppRouter;

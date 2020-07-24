import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFirebase } from "react-redux-firebase";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import "firebase/analytics";
import { setUser } from "actions";

import Register from "pages/Account/Register";
import Profile from "pages/Account/Profile";
import Questions from "pages/Account/Questions";
import CodeOfConduct from "pages/Account/CodeOfConduct";
import Login from "pages/Account/Login";
import SparkleSpaceMarketingPage from "pages/SparkleSpaceMarketingPage";
import EntranceExperience from "components/venues/Jazzbar/EntranceExperience";
import VenuePage from "pages/VenuePage";

import { leaveRoom } from "utils/useLocationUpdateEffect";

const AppRouter = () => {
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const analytics = firebase.analytics();
  const { user } = useSelector((state) => ({
    user: state.user,
  }));

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      dispatch(setUser(user));
    });
  }, [user, dispatch, firebase]);

  const onClickWindow = (event) => {
    event.target.id &&
      user &&
      analytics.logEvent("clickonbutton", {
        buttonId: event.target.id,
        userId: user.uid,
      });
  };

  const leaveRoomBeforeUnload = () => {
    if (user) {
      leaveRoom(user);
    }
  };

  useEffect(() => {
    window.addEventListener("click", onClickWindow, false);
    window.addEventListener("onbeforeunload", leaveRoomBeforeUnload, false);
    return () => {
      window.removeEventListener("click", onClickWindow, false);
      window.removeEventListener(
        "onbeforeunload",
        leaveRoomBeforeUnload,
        false
      );
    };
  });

  return (
    <Router basename="/">
      <Switch>
        <Route path="/SparkleVerse" component={SparkleSpaceMarketingPage} />
        <Route path="/account/register" component={Register} />
        <Route path="/account/profile" component={Profile} />
        <Route path="/account/questions" component={Questions} />
        <Route path="/account/code-of-conduct" component={CodeOfConduct} />
        <Route path="/login" component={Login} />
        <Route exact path="/venue/:venueId" component={EntranceExperience} />
        <Route path="/venue/:venueId/event/:eventId" component={VenuePage} />
        <Route
          path="/"
          component={() => <Redirect to="/venue/kansassmittys" />}
        />
      </Switch>
    </Router>
  );
};

export default AppRouter;
